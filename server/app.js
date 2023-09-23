const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
var format = require("pg-format");

const { Client } = require("pg");

// (async () => {
//     await client.connect();
//     try {
//         const results = await client.query(
//             "CREATE TABLE food_supply (supply_id DECIMAL(38) NOT NULL,name VARCHAR(100) NULL,address VARCHAR(255) NULL,CONSTRAINT food_supply_pkey PRIMARY KEY (supply_id));"
//         );
//         console.log(results);
//     } catch (err) {
//         console.error("error executing query:", err);
//     } finally {
//         client.end();
//     }
// })();

// (async () => {
//     await client.connect();
//     try {
//         const results = await client.query(
//             "CREATE TABLE customer (cust_id DECIMAL(38) NOT NULL,name VARCHAR(100) NULL,contact_num VARCHAR(11) NULL,address VARCHAR(100) NULL,CONSTRAINT customer_pkey PRIMARY KEY (cust_id))"
//         );
//         console.log(results);
//     } catch (err) {
//         console.error("error executing query:", err);
//     } finally {
//         client.end();
//     }
// })();

// (async () => {
//     await client.connect();
//     try {
//         const results = await client.query(
//             "CREATE TABLE food_product (food_id DECIMAL(38) NOT NULL,name VARCHAR(100) NULL,    description VARCHAR(255) NULL,    price VARCHAR(11) NULL,    supply_id DECIMAL(38) NULL,    CONSTRAINT food_product_pkey PRIMARY KEY (food_id),    CONSTRAINT food_product_supply_id_fkey FOREIGN KEY (supply_id) REFERENCES public.food_supply(supply_id)  )  "
//         );
//         console.log(results);
//     } catch (err) {
//         console.error("error executing query:", err);
//     } finally {
//         client.end();
//     }
// })();

// (async () => {
//     await client.connect();
//     try {
//         const results = await client.query(
//             "CREATE TABLE delivery (   delivery_id DECIMAL(38) NOT NULL,    cust_id DECIMAL(38) NULL,    food_id DECIMAL(38) NULL,    quantity DECIMAL(38) NULL,    payment VARCHAR(20) NULL,    delivery_date TIMESTAMP(0) NULL,    CONSTRAINT delivery_pkey PRIMARY KEY (delivery_id),    CONSTRAINT delivery_cust_id_fkey FOREIGN KEY (cust_id) REFERENCES public.customer(cust_id),    CONSTRAINT delivery_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food_product(food_id)  )"
//         );
//         console.log(results);
//     } catch (err) {
//         console.error("error executing query:", err);
//     } finally {
//         client.end();
//     }
// })();

// (async () => {
//     await client.connect();
//     try {
//         const results = await client.query(
//             "CREATE TABLE order_details (    order_id DECIMAL(38) NOT NULL,    cust_id DECIMAL(38) NULL,    food_id DECIMAL(38) NULL,    quantity DECIMAL(38) NULL,    delivery_id DECIMAL(38) NULL,   order_date TIMESTAMP(0) NULL,    CONSTRAINT order_details_pkey PRIMARY KEY (order_id),    CONSTRAINT order_details_cust_id_fkey FOREIGN KEY (cust_id) REFERENCES public.customer(cust_id),    CONSTRAINT order_details_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food_product(food_id),    CONSTRAINT order_details_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.delivery(delivery_id)  )"
//         );
//         console.log(results);
//     } catch (err) {
//         console.error("error executing query:", err);
//     } finally {
//         client.end();
//     }
// })();
// (async () => {
//     await client.connect();
//     try {
//         const results = await client.query(
//             "CREATE TABLE public.transaction_reports (    order_id DECIMAL(38) NOT NULL,    cust_id DECIMAL(38) NULL,    food_id DECIMAL(38) NULL,    supply_id DECIMAL(38) NULL,    delivery_id DECIMAL(38) NULL,    report_date TIMESTAMP(0) NULL,    time VARCHAR(10) NULL,    CONSTRAINT transaction_reports_pkey PRIMARY KEY (order_id),    CONSTRAINT transaction_reports_cust_id_fkey FOREIGN KEY (cust_id) REFERENCES public.customer(cust_id),    CONSTRAINT transaction_reports_food_id_fkey FOREIGN KEY (food_id) REFERENCES public.food_product(food_id),    CONSTRAINT transaction_reports_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.delivery(delivery_id),    CONSTRAINT transaction_reports_supply_id_fkey FOREIGN KEY (supply_id) REFERENCES public.food_supply(supply_id),    CONSTRAINT transaction_reports_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.order_details(order_id)  )"
//         );
//         console.log(results);
//     } catch (err) {
//         console.error("error executing query:", err);
//     } finally {
//         client.end();
//     }
// })();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.send("Hello World!");
});

app.post("/getOrders", async (req, res) => {
    console.log(req.body.cust_id);
    let resp = await getOrders(req.body.cust_id);
    res.json(resp);
});

app.post("/getSupply", async (req, res) => {
    console.log(req.body.supply_id);
    let resp = await getRequests(req.body.supply_id);
    res.json(resp);
});

app.post("/supplyItems", async (req, res) => {
    let temp = await getSupplyItems(req.body.supply_id);
    res.json(temp);
});

app.post("/addItems", async (req, res) => {
    await addItems(req.body.data, req.body.supply_id);
    res.sendStatus(200);
});

app.post("/customer", async (req, res) => {
    let val = await setCustomer(req.body);
    res.json(val);
});

app.post("/submit", async (req, res) => {
    await submitOrder(req.body.cust_id, req.body.orderedItems);
    res.sendStatus(200);
});

app.get("/food", async (req, res) => {
    let temp = await getItems();
    res.json(temp);
});

app.post("/supplier", async (req, res) => {
    let val = await setSupplier(req.body);
    res.json(val);
});

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}!`);
});

const getItems = async () => {
    let client;
    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database");

        const { rows } = await client.query("select * from food_product");

        rows.forEach(async (x) => {
            let clien = new Client(process.env.DATABASE_URL);
            let res = await clien.query(
                `select name from food_supply where supply_id=${x.supply_id}`
            );
            let rs = res.rows;
            clien.end();
            let temp_name;
            rs.forEach((y) => (temp_name = y.name));
            x.supply_name = temp_name;
        });

        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                await client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const addItems = async (data, supply_id) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database");

        const { rows } = await client.query(
            "select max(food_id) as id from food_product"
        );
        let temp_id = 0;

        rows.forEach((x) => (x.id ? (temp_id = x.id + 1) : (temp_id = 0)));
        console.log(temp_id);

        const res = await client.query(
            `insert into food_product values(${temp_id}, '${data.name}', '${data.description}','${data.price}', ${supply_id})`
        );
        console.log(res);
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const getSupplyItems = async (supply_id) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database : get supply");

        const { rows } = await client.query(
            `select * from food_product where supply_id=${supply_id}`
        );

        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const getOrders = async (cust_id) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database : get orders");

        const { rows } = await client.query(
            `select delivery.delivery_id as delivery_id, customer.name as cust_name,customer.contact_num as phno,customer.address as cust_address,food_product.name as food_name,food_supply.name as supply_name,food_supply.address as supply_address,delivery.quantity as food_quantity,delivery.payment as payment,delivery.delivery_date as order_date,transaction_reports.time as  order_time  from delivery,food_supply,food_product,customer,transaction_reports where transaction_reports.cust_id = ${cust_id} and transaction_reports.delivery_id=delivery.delivery_id and transaction_reports.supply_id=food_supply.supply_id and transaction_reports.cust_id = customer.cust_id and food_product.food_id = transaction_reports.food_id`
        );

        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const getRequests = async (supply_id) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log(
            "Successfully connected to postgres Database : get supply orders"
        );

        const { rows } = await client.query(
            `select delivery.delivery_id as delivery_id, customer.name as cust_name,customer.contact_num as phno,customer.address as cust_address,food_product.name as food_name,food_supply.name as supply_name,food_supply.address as supply_address,delivery.quantity as food_quantity,delivery.payment as payment,delivery.delivery_date as order_date,transaction_reports.time as  order_time  from delivery,food_supply,food_product,customer,transaction_reports where transaction_reports.supply_id = ${supply_id} and transaction_reports.delivery_id=delivery.delivery_id and transaction_reports.supply_id=food_supply.supply_id and transaction_reports.cust_id = customer.cust_id and food_product.food_id = transaction_reports.food_id`
        );

        return rows;
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const setCustomer = async (data) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database");

        const { rows } = await client.query(
            "select max(cust_id) as id from customer"
        );
        let temp_id = 0;

        rows.forEach((x) => (x.id ? (temp_id = x.id + 1) : (temp_id = 0)));
        console.log(temp_id);

        const res = await client.query(
            `insert into customer values(${temp_id},'${data.name}','${data.number}','${data.address}')`
        );
        console.log(res);
        return temp_id;
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const setSupplier = async (data) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database");

        const { rows } = await client.query(
            "select max(supply_id) as id from food_supply"
        );
        let temp_id = 0;

        rows.forEach((x) => (x.id ? (temp_id = x.id + 1) : (temp_id = 0)));
        console.log(temp_id);

        const res = await client.query(
            `insert into food_supply values(${temp_id},'${data.name}','${data.address}')`
        );
        console.log(res);
        return temp_id;
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const submitOrder = async (cust_id, data) => {
    let client;

    try {
        client = new Client(process.env.DATABASE_URL);
        await client.connect();

        console.log("Successfully connected to postgres Database");

        const date = new Date();
        let timeZone = "Asia/Kolkata";
        const time = new Intl.DateTimeFormat("en-US", {
            timeStyle: "short",
            timeZone,
        }).format(date);
        const formattedDate = date
            .toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
            })
            .replace(/ /g, "-");

        // to get temporary delivery id

        let res = await client.query(
            "select max(delivery_id) as id from delivery"
        );
        let rs = res.rows;
        let temp_delivery_id = 0;
        rs.forEach((x) =>
            x.id ? (temp_delivery_id = x.id + 1) : (temp_delivery_id = 0)
        );

        // to get temporary order id

        res = await client.query(
            "select max(order_id) as id from order_details"
        );
        rs = res.rows;
        let temp_order_id = 0;
        rs.forEach((x) =>
            x.id ? (temp_order_id = x.id + 1) : (temp_order_id = 0)
        );

        // to get temporary transactional report id

        res = await client.query(
            "select max(order_id) as id from transaction_reports"
        );
        rs = res.rows;
        let temp_transaction_id = 0;
        rs.forEach((x) =>
            x.id ? (temp_transaction_id = x.id + 1) : (temp_transaction_id = 0)
        );

        console.log(
            `del id :${temp_delivery_id}  order id :${temp_order_id} transaction id :${temp_transaction_id}`
        );

        // now delivery update part
        let rows = [];
        data.forEach((item) => {
            rows.push([
                temp_delivery_id,
                cust_id,
                item.id,
                item.amount,
                (item.price * item.amount).toString(),
                formattedDate,
            ]);
            temp_delivery_id++;
        });
        console.log(rows);

        let result = await client.query(
            format("insert into delivery values %L", rows)
        );

        console.log(result);

        // now update order details

        let order_rows = [];
        let report_rows = [];
        rows.forEach((item) => {
            order_rows.push([
                temp_order_id,
                item[1],
                item[2],
                item[3],
                item[0],
                item[5],
            ]);
            temp_order_id++;
        });
        // update transaction_report
        order_rows.forEach((item) => {
            data.forEach((foodItem) => {
                if (foodItem.id == item[2]) {
                    report_rows.push([
                        temp_transaction_id,
                        item[1],
                        item[2],
                        foodItem.supply_id,
                        item[4],
                        item[5],
                        time,
                    ]);
                }
            });
            temp_transaction_id++;
        });
        console.log(order_rows);

        let sql = `insert into order_details values($1, $2, $3, $4, $5, $6)`;

        result = await client.query(
            format("insert into order_details values %L", order_rows)
        );

        console.log(result);

        console.log(report_rows);

        sql = `insert into transaction_reports values($1, $2, $3, $4, $5, $6,$7)`;

        result = await client.query(
            format("insert into transaction_reports values %L", report_rows)
        );

        console.log(result);
    } catch (err) {
        console.error(err);
    } finally {
        if (client) {
            try {
                client.end();
            } catch (err) {
                console.error(err);
            }
        }
    }
};
