import {MINI_SPONSORS} from '../../data';
import {getTierSponsors} from '../../lib/utils/openCollective';

export default async function handler(req, res) {
  const activeMembers = await getTierSponsors(
    'floating-ui',
    'Mini Sponsor'
  );

  res
    .status(200)
    .json(
      MINI_SPONSORS.filter((s) =>
        activeMembers.some((x) => x.MemberId === s.MemberId)
      )
    );
}
