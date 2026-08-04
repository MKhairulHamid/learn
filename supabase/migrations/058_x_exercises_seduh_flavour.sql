-- ============================================================
-- 058: Re-theme the few X-program matching exercises whose pairs referenced
--      the old grocery/ecommerce framing, to match the Seduh prose (057).
--
--   Only four exercises actually named wrong things; the rest of the matching
--   bank is concept-level (Mean ↔ average, JOIN ↔ definition) and dataset-neutral.
--
--   Matching exercises store the pairs in starter_code (text) and the correct
--   right-hand answer per pair in test_cases.expected_value (jsonb). Where a
--   right-hand value changes, BOTH must change by the same string, or the answer
--   key drifts from what the learner sees. X01#9 and X05#3 change only left-hand
--   prompts, so their test_cases are untouched.
-- ============================================================

-- X01 #9 — align the stats prompts with the rewritten lesson
-- (order value / channels / dispatch, not basket / stores / fulfilment).
UPDATE public.exercises e
SET starter_code = replace(replace(replace(e.starter_code,
  'Mean basket is 84.6 but the median is 49',
  'Mean order value is 84.6 but the median is 49'),
  'Revenue is flat while average fulfilment time climbs',
  'Revenue is flat while average dispatch time climbs'),
  'Two stores share a mean of 50k; std dev is 5 vs 40',
  'Two channels share a mean of 50k; std dev is 5 vs 40')
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X01' AND e.order_num = 9;

-- X05 #3 — left-hand prompts only (rights are Observation/Insight/Recommendation).
UPDATE public.exercises e
SET starter_code = replace(replace(e.starter_code,
  'Jakarta leads because premium members cluster there',
  'Jakarta leads because repeat buyers cluster there'),
  'Pilot a premium bundle in Jakarta',
  'Pilot a Roasted-Beans bundle in Jakarta')
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X05' AND e.order_num = 3;

-- X05 #10 — right-hand statements change, so update starter_code AND test_cases.
UPDATE public.exercises e
SET starter_code = replace(replace(replace(replace(e.starter_code,
  'Jakarta over-indexes because premium members cluster there',
  'Jakarta over-indexes because repeat buyers cluster there'),
  'Pilot a premium Electronics bundle in Jakarta next quarter',
  'Pilot a Roasted-Beans subscription offer in Jakarta next quarter'),
  'Does premium density also predict basket size elsewhere?',
  'Do repeat buyers also lift order value elsewhere?'),
  'The table contains 12,480 rows',
  'The table contains 24,155 rows'),
    test_cases = replace(replace(replace(replace(e.test_cases::text,
  'Jakarta over-indexes because premium members cluster there',
  'Jakarta over-indexes because repeat buyers cluster there'),
  'Pilot a premium Electronics bundle in Jakarta next quarter',
  'Pilot a Roasted-Beans subscription offer in Jakarta next quarter'),
  'Does premium density also predict basket size elsewhere?',
  'Do repeat buyers also lift order value elsewhere?'),
  'The table contains 12,480 rows',
  'The table contains 24,155 rows')::jsonb
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X05' AND e.order_num = 10;

-- X07 #4 — DAX measures on Seduh's model (no total_amount; revenue is computed).
UPDATE public.exercises e
SET starter_code = replace(replace(replace(replace(replace(replace(e.starter_code,
  'SUM(orders[total_amount])',
  'SUMX(orders, orders[quantity] * orders[unit_price])'),
  'DISTINCTCOUNT(orders[id])',
  'DISTINCTCOUNT(orders[customer_id])'),
  'AVERAGE(orders[total_amount])',
  'AVERAGE(orders[rating])'),
  'Total revenue',
  'Total gross revenue'),
  'Number of distinct orders',
  'Number of distinct customers'),
  'Mean order amount',
  'Mean order rating'),
    test_cases = replace(replace(replace(e.test_cases::text,
  'Total revenue',
  'Total gross revenue'),
  'Number of distinct orders',
  'Number of distinct customers'),
  'Mean order amount',
  'Mean order rating')::jsonb
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X07' AND e.order_num = 4;

-- X01 #9 — tidy the internal pass/fail label to match the reworded prompt.
UPDATE public.exercises e
SET test_cases = replace(replace(e.test_cases::text,
  'Fulfilment time matched', 'Dispatch time matched'),
  'Waktu pemenuhan cocok', 'Waktu dispatch cocok')::jsonb
FROM public.sessions s
WHERE e.session_id = s.id AND s.session_number = 'X01' AND e.order_num = 9;
