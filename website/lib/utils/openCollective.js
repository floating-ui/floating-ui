const TIER_AMOUNTS = {
  'Mini Sponsor': 20,
  'Website Sponsor': 100,
};

export async function getTierSponsors(collectiveSlug, tierName) {
  const response = await fetch(
    `https://opencollective.com/${collectiveSlug}/members/all.json`
  );
  const data = await response.json();

  if (response.ok) {
    return data.filter(
      (member) =>
        (member.tier === tierName ||
          member.lastTransactionAmount ===
            TIER_AMOUNTS[tierName]) &&
        member.isActive
    );
  } else {
    throw new Error(data.error);
  }
}
