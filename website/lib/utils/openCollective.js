const TIER_AMOUNTS = {
  'Mini Sponsor': 20,
  'Website Sponsor': 100,
};

export function isDateWithinLastMonth(date) {
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );

  return date > oneMonthAgo;
}

export async function getTierSponsors(collectiveSlug, tierName) {
  const response = await fetch(
    `https://opencollective.com/${collectiveSlug}/members/all.json`,
  );
  const data = await response.json();

  if (response.ok) {
    const isMatchingTier = (member) => {
      const result =
        member.lastTransactionAmount ===
          TIER_AMOUNTS[tierName] &&
        isDateWithinLastMonth(
          new Date(member.lastTransactionAt),
        );
      return result;
    };

    return data.filter(
      (member) => member.isActive && isMatchingTier(member),
    );
  } else {
    throw new Error(data.error);
  }
}

// Manual sponsors are listed with an `expiresAt` date (YYYY-MM-DD) instead of
// a MemberId, for sponsorships arranged outside of an Open Collective tier.
export function isManuallyActive(item, now = new Date()) {
  if (!item.expiresAt) return false;
  const expiry = new Date(`${item.expiresAt}T23:59:59Z`);
  return !Number.isNaN(expiry.getTime()) && expiry >= now;
}

// A sponsor shows if it matches a live Open Collective tier member, or if it
// is a manual entry that has not expired yet.
export function isSponsorActive(
  item,
  members,
  now = new Date(),
) {
  const matchesTier =
    item.MemberId != null &&
    members.some((member) => member.MemberId === item.MemberId);
  return matchesTier || isManuallyActive(item, now);
}
