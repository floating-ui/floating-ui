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
