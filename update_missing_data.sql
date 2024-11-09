UPDATE analytics AS a
  SET transfer = coalesce(transfer, (
      SELECT transfer from analytics AS b
        WHERE b.url = a.name and b.date < a.date
        ORDER BY date DESC LIMIT 1)) AS transfer;

# for testing the statement first
SELECT url, coalesce(transfer, (
      SELECT transfer from analytics AS b
        WHERE b.url = analytics.url and b.date < analytics.date and b.transfer is not null and b.transfer!=0
        ORDER BY date DESC LIMIT 1)) AS transfer
FROM analytics;

# ignoring date and added random final option
SELECT url, coalesce(transfer, (
      SELECT transfer from analytics AS b
        WHERE b.url = analytics.url and b.transfer is not null and b.transfer!=0
        ORDER BY date DESC LIMIT 1)) AS transfer
FROM analytics;

SELECT url, coalesce(transfer, (
      SELECT transfer from analytics AS b
        WHERE b.url = analytics.url and b.transfer is not null and b.transfer!=0
        ORDER BY date DESC LIMIT 1), trunc(random() * 100000 + 1000)) AS transfer
FROM analytics;




