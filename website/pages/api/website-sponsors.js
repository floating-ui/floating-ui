import {SPONSORS} from '../../data';
import {getTierSponsors} from '../../lib/utils/openCollective';

export default async function handler(req, res) {
  const activeMembers = await getTierSponsors(
    'floating-ui',
    'Website Sponsor'
  );

  res
    .status(200)
    .json(
      SPONSORS.filter((s) =>
        activeMembers.some((x) => x.MemberId === s.MemberId)
      )
    );
}
