let query_NSEBSE_Count = `select exchange, status, count(*) from segment
    join user_id on segment.app_number = user_id.app_number
where exchange in ('bse', 'nse') and user_id.create_ts >= '2023-01-01'
group by exchange, status;`;

let quert_VSPCount = `select Count(a.app_number)
from basic a left join
(select app_number, count(*) not_approved from segment where exchange in ('nse', 'bse') and status != 'approved' group by app_number) b on a.app_number = b.app_number left join
(select app_number, count(*) approved from segment where exchange in ('nse', 'bse') and status = 'approved' group by app_number) c on a.app_number = c.app_number
where a.status = 'A' and coalesce(b.not_approved, 0) = 0 and coalesce(c.approved, 0) > 0 and a.create_ts >= '2023-01-01';`;

module.exports = { query_NSEBSE_Count, quert_VSPCount };
