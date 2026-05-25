// Retail dataset for Python/Pandas practice
// Two CSV files: transactions (60 rows) and employees (25 rows)

export const TRANSACTIONS_CSV = `transaction_id,date,product,category,region,city,quantity,unit_price,total_amount,sales_rep,channel
T001,2024-01-05,Laptop Pro,Electronics,Java,Jakarta,1,12500000,12500000,Budi Santoso,online
T002,2024-01-08,Wireless Mouse,Accessories,Java,Surabaya,2,285000,570000,Siti Rahayu,in-store
T003,2024-01-11,Monitor 27-inch,Electronics,Sumatra,Medan,1,4750000,4750000,Ahmad Fauzi,online
T004,2024-01-14,Python Programming,Books,Java,Bandung,3,185000,555000,Dewi Lestari,in-store
T005,2024-01-18,Ergonomic Chair,Furniture,Java,Jakarta,1,4500000,4500000,Rizky Pratama,online
T006,2024-01-22,USB-C Hub,Accessories,Bali,Denpasar,2,450000,900000,Nur Hidayah,in-store
T007,2024-01-25,Mechanical Keyboard,Accessories,Java,Semarang,1,850000,850000,Wahyu Setiawan,online
T008,2024-01-28,Data Analytics Guide,Books,Sumatra,Palembang,2,165000,330000,Fitri Handayani,in-store
T009,2024-02-02,Standing Desk,Furniture,Java,Jakarta,1,3200000,3200000,Eko Prasetyo,online
T010,2024-02-05,Webcam HD,Electronics,Sulawesi,Makassar,1,750000,750000,Maya Indrawati,in-store
T011,2024-02-09,Laptop Pro,Electronics,Java,Jakarta,2,12500000,25000000,Budi Santoso,online
T012,2024-02-12,Monitor 27-inch,Electronics,Java,Surabaya,1,4750000,4750000,Siti Rahayu,online
T013,2024-02-15,Ergonomic Chair,Furniture,Kalimantan,Balikpapan,1,4500000,4500000,Ahmad Fauzi,in-store
T014,2024-02-19,USB-C Hub,Accessories,Java,Bandung,3,450000,1350000,Dewi Lestari,online
T015,2024-02-22,Python Programming,Books,Java,Yogyakarta,5,185000,925000,Rizky Pratama,in-store
T016,2024-03-01,Mechanical Keyboard,Accessories,Java,Jakarta,2,850000,1700000,Nur Hidayah,online
T017,2024-03-05,Wireless Mouse,Accessories,Sumatra,Medan,4,285000,1140000,Wahyu Setiawan,in-store
T018,2024-03-09,Standing Desk,Furniture,Java,Semarang,1,3200000,3200000,Fitri Handayani,online
T019,2024-03-13,Data Analytics Guide,Books,Bali,Denpasar,3,165000,495000,Eko Prasetyo,in-store
T020,2024-03-17,Webcam HD,Electronics,Java,Jakarta,2,750000,1500000,Maya Indrawati,online
T021,2024-03-21,Laptop Pro,Electronics,Sulawesi,Makassar,1,12500000,12500000,Budi Santoso,online
T022,2024-03-25,Monitor 27-inch,Electronics,Java,Surabaya,2,4750000,9500000,Siti Rahayu,online
T023,2024-04-01,Ergonomic Chair,Furniture,Java,Jakarta,2,4500000,9000000,Ahmad Fauzi,in-store
T024,2024-04-05,Python Programming,Books,Kalimantan,Balikpapan,4,185000,740000,Dewi Lestari,in-store
T025,2024-04-09,USB-C Hub,Accessories,Java,Bandung,1,450000,450000,Rizky Pratama,online
T026,2024-04-13,Mechanical Keyboard,Accessories,Sumatra,Palembang,2,850000,1700000,Nur Hidayah,online
T027,2024-04-17,Standing Desk,Furniture,Java,Jakarta,1,3200000,3200000,Wahyu Setiawan,online
T028,2024-04-21,Wireless Mouse,Accessories,Bali,Denpasar,3,285000,855000,Fitri Handayani,in-store
T029,2024-04-25,Data Analytics Guide,Books,Java,Yogyakarta,2,165000,330000,Eko Prasetyo,in-store
T030,2024-05-02,Webcam HD,Electronics,Java,Surabaya,1,750000,750000,Maya Indrawati,online
T031,2024-05-06,Laptop Pro,Electronics,Java,Jakarta,1,12500000,12500000,Budi Santoso,online
T032,2024-05-10,Monitor 27-inch,Electronics,Sumatra,Medan,1,4750000,4750000,Siti Rahayu,online
T033,2024-05-14,Ergonomic Chair,Furniture,Java,Semarang,1,4500000,4500000,Ahmad Fauzi,in-store
T034,2024-05-18,USB-C Hub,Accessories,Sulawesi,Makassar,2,450000,900000,Dewi Lestari,in-store
T035,2024-05-22,Python Programming,Books,Java,Jakarta,6,185000,1110000,Rizky Pratama,online
T036,2024-06-01,Mechanical Keyboard,Accessories,Java,Bandung,1,850000,850000,Nur Hidayah,online
T037,2024-06-05,Standing Desk,Furniture,Kalimantan,Balikpapan,1,3200000,3200000,Wahyu Setiawan,online
T038,2024-06-09,Wireless Mouse,Accessories,Java,Jakarta,5,285000,1425000,Fitri Handayani,in-store
T039,2024-06-13,Data Analytics Guide,Books,Bali,Denpasar,2,165000,330000,Eko Prasetyo,online
T040,2024-06-17,Webcam HD,Electronics,Java,Surabaya,3,750000,2250000,Maya Indrawati,online
T041,2024-07-02,Laptop Pro,Electronics,Java,Jakarta,1,12500000,12500000,Budi Santoso,online
T042,2024-07-07,Monitor 27-inch,Electronics,Java,Bandung,1,4750000,4750000,Siti Rahayu,online
T043,2024-07-12,Ergonomic Chair,Furniture,Sumatra,Medan,1,4500000,4500000,Ahmad Fauzi,in-store
T044,2024-07-17,USB-C Hub,Accessories,Java,Jakarta,4,450000,1800000,Dewi Lestari,online
T045,2024-07-22,Python Programming,Books,Java,Yogyakarta,3,185000,555000,Rizky Pratama,in-store
T046,2024-08-01,Mechanical Keyboard,Accessories,Sulawesi,Makassar,2,850000,1700000,Nur Hidayah,online
T047,2024-08-06,Standing Desk,Furniture,Java,Surabaya,1,3200000,3200000,Wahyu Setiawan,online
T048,2024-08-11,Wireless Mouse,Accessories,Kalimantan,Balikpapan,3,285000,855000,Fitri Handayani,in-store
T049,2024-08-16,Data Analytics Guide,Books,Java,Jakarta,4,165000,660000,Eko Prasetyo,online
T050,2024-08-21,Webcam HD,Electronics,Bali,Denpasar,2,750000,1500000,Maya Indrawati,in-store
T051,2024-09-03,Laptop Pro,Electronics,Java,Semarang,1,12500000,12500000,Budi Santoso,online
T052,2024-09-08,Monitor 27-inch,Electronics,Sumatra,Palembang,1,4750000,4750000,Siti Rahayu,online
T053,2024-09-13,Ergonomic Chair,Furniture,Java,Jakarta,2,4500000,9000000,Ahmad Fauzi,in-store
T054,2024-09-18,Mechanical Keyboard,Accessories,Java,Bandung,3,850000,2550000,Dewi Lestari,online
T055,2024-09-23,Python Programming,Books,Sulawesi,Makassar,5,185000,925000,Rizky Pratama,in-store
T056,2024-10-02,Standing Desk,Furniture,Java,Jakarta,1,3200000,3200000,Nur Hidayah,online
T057,2024-10-07,Wireless Mouse,Accessories,Java,Surabaya,6,285000,1710000,Wahyu Setiawan,in-store
T058,2024-10-12,Data Analytics Guide,Books,Bali,Denpasar,2,165000,330000,Fitri Handayani,online
T059,2024-10-17,Webcam HD,Electronics,Kalimantan,Balikpapan,1,750000,750000,Eko Prasetyo,in-store
T060,2024-10-22,Monitor 27-inch,Electronics,Java,Jakarta,1,4750000,4750000,Maya Indrawati,online`

export const EMPLOYEES_CSV = `emp_id,name,department,position,hire_date,salary,performance_score,region
E001,Andi Wijaya,Engineering,Senior Engineer,2020-03-15,18000000,4.5,Java
E002,Budi Santoso,Sales,Account Executive,2021-06-01,12000000,4.2,Java
E003,Citra Dewi,Marketing,Marketing Manager,2019-08-20,15000000,4.7,Java
E004,Dian Kusuma,Finance,Financial Analyst,2022-01-10,13000000,3.8,Java
E005,Eko Nugroho,Engineering,Data Engineer,2021-04-15,17000000,4.4,Java
E006,Fira Handayani,HR,HR Specialist,2022-07-01,10500000,4.0,Java
E007,Gilang Ramadhan,Engineering,DevOps Engineer,2020-09-01,16500000,4.3,Sumatra
E008,Hana Puspita,Marketing,Content Specialist,2023-01-15,9500000,3.5,Sumatra
E009,Irfan Maulana,Sales,Sales Manager,2019-05-20,16000000,4.6,Sumatra
E010,Jasmine Putri,Finance,Finance Manager,2018-11-01,20000000,4.8,Java
E011,Kevin Hartono,Engineering,Backend Engineer,2022-09-01,15000000,3.9,Java
E012,Laila Sari,HR,HR Manager,2019-02-15,14000000,4.5,Java
E013,Made Surya,Engineering,ML Engineer,2021-11-01,19000000,4.6,Bali
E014,Nadia Rahman,Marketing,Digital Marketer,2022-03-01,10000000,3.7,Java
E015,Omar Faruq,Sales,Account Executive,2023-03-01,12500000,3.6,Kalimantan
E016,Putri Ayu,Finance,Financial Analyst,2022-06-15,13500000,4.1,Java
E017,Qori Ananda,Engineering,Frontend Engineer,2021-07-01,14500000,4.0,Java
E018,Rahmat Hidayat,Sales,Sales Rep,2023-07-01,10000000,3.4,Sulawesi
E019,Sari Wulandari,Marketing,Brand Manager,2020-04-15,14500000,4.3,Java
E020,Taufik Ismail,Engineering,Senior Engineer,2019-10-01,19500000,4.7,Java
E021,Utami Ratna,HR,HR Coordinator,2023-02-01,9000000,3.8,Java
E022,Vino Prasetya,Finance,Tax Analyst,2022-08-01,14000000,4.0,Java
E023,Winda Sari,Engineering,Data Analyst,2022-11-15,16000000,4.2,Java
E024,Xena Marlina,Marketing,SEO Specialist,2023-04-01,9500000,3.9,Bali
E025,Yudha Pratama,Sales,Key Account Mgr,2020-07-01,18000000,4.5,Java`

export const CSV_DATASET_INFO = {
  files: [
    {
      name: 'transactions.csv',
      description: '60 retail sales across 5 regions',
      columns: ['transaction_id', 'date', 'product', 'category', 'region', 'city', 'quantity', 'unit_price', 'total_amount', 'sales_rep', 'channel'],
      rowCount: 60,
    },
    {
      name: 'employees.csv',
      description: '25 employees, 5 departments',
      columns: ['emp_id', 'name', 'department', 'position', 'hire_date', 'salary', 'performance_score', 'region'],
      rowCount: 25,
    },
  ],
}
