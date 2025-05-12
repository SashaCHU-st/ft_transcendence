// import sqlite3 from "better-sqlite3"
import Database from "better-sqlite3";
const db = new Database("./database/test.db");

db.exec(
  `-- Удалим таблицы, если уже существуют
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS fraud;

-- Создание таблицы transactions
CREATE TABLE transactions (
  transaction_id INT PRIMARY KEY,
  country VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  transaction_datetime TIMESTAMP NOT NULL,
  type VARCHAR(10) CHECK (type IN ('payment', 'refund')),
  value DECIMAL(15,2) NOT NULL
);

-- Вставка данных
INSERT INTO transactions (transaction_id, country, city, transaction_datetime, type, value) VALUES
(1000, 'UK', 'London', '2024-12-19 09:05:58', 'refund', 4765.12),
(1001, 'UK', 'London', '2024-12-21 16:00:41', 'payment', 182780.70),
(1002, 'UAE', 'Dubai', '2024-12-04 03:01:50', NULL, 3439.04),
(1003, 'UAE', 'Dubai', '2024-12-04 18:32:43', 'payment', 4701.94),
(1007, 'Russia', 'Moscow', '2024-12-26 14:10:05', 'refund', 17000.11);

WITH
-- Среднее значение всех транзакций с непустым типом
avg_all AS (
  SELECT AVG(value) AS avg_val
  FROM transactions
  WHERE type IS NOT NULL
),
-- Среднее значение только по payment-транзакциям
avg_payments AS (
  SELECT AVG(value) AS avg_val
  FROM transactions
  WHERE type = 'payment'
)

SELECT
  t.transaction_id,
  CASE
    WHEN t.transaction_id % 2 = 0 THEN 'false'  -- Четные — не фрод
    WHEN t.transaction_id % 2 = 1 AND t.city = 'London' AND t.value > (SELECT avg_val FROM avg_all) * 2 THEN 'true'
    WHEN t.transaction_id % 2 = 1 AND t.city != 'London' AND t.value > (SELECT avg_val FROM avg_payments) * 3 THEN 'true'
    ELSE 'false'
  END AS is_fraud
FROM transactions t
ORDER BY t.transaction_id;



`
);
