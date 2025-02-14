import schedule from "node-schedule"
import { prisma } from "../../../utils"
import { getListing } from "./listings.service"
import { ListingWithBids } from "./listings.controller"

/**
 * Either award a user credits or do nothing depending on their current credit amount
 * @param name name of the auction profile user to locate
 * @param increment amount of credits to award
 * @param max maximum amount of credits that is allowed
 */
export async function awardCreditsOrCap(name: string, increment: number, max = 1_000_000) {
  const user = await prisma.auctionProfile.findUnique({
    where: { name }
  })

  if (user && user.credits + increment <= max) {
    await prisma.auctionProfile.update({
      where: { name },
      data: { credits: { increment } }
    })
  }
}

/**
 * Schedule a cron-job to transfer winning bid credits to the seller of the listing.
 * This should be called when a listing is created.
 * @param listingId id of the listing to schedule
 * @param endsAt date when listing ends
 */
export async function scheduleCreditsTransfer(listingId: string, endsAt: Date): Promise<void> {
  schedule.scheduleJob(endsAt, async () => {
    // Get listing
    const listing = (await getListing(listingId, { bids: true })) as ListingWithBids

    if (listing && listing.bids.length > 0) {
      // Get highest bid of listing
      const [winner, ...losers] = listing.bids.sort((a, b) => b.amount - a.amount)

      // Add listing id to winner wins
      await prisma.auctionProfile.update({
        where: { name: winner.bidderName },
        data: {
          wins: { push: listingId }
        }
      })

      // Transfer credits from highest bid to seller
      await awardCreditsOrCap(listing.sellerName, winner.amount)

      // Transfer all non-winning bids back to their bidders
      await Promise.all(losers.map(bid => awardCreditsOrCap(bid.bidderName, bid.amount)))
    }
  })
}
