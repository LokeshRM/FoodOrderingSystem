const express = require("express");
const bodyParser = require("body-parser");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function run() {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        // // Create a table

        // await connection.execute(`begin
        //                             execute immediate 'drop table todoitem';
        //                             exception when others then if sqlcode <> -942 then raise; end if;
        //                           end;`);

        // await connection.execute(`create table todoitem (
        //                             id number generated always as identity,
        //                             description varchar2(4000),
        //                             creation_ts timestamp with time zone default current_timestamp,
        //                             done number(1,0),
        //                             primary key (id))`);

        // // Insert some data

        // const sql = `insert into todoitem (description, done) values(:1, :2)`;

        // const rows =
        //       [ ["Task 1", 0 ],
        //         ["Task 2", 0 ],
        //         ["Task 3", 1 ],
        //         ["Task 4", 0 ],
        //         ["Task 5", 1 ] ];

        // let result = await connection.executeMany(sql, rows);

        // console.log(result.rowsAffected, "Rows Inserted");

        // connection.commit();

        // Now query the rows back

        result = await connection.execute(`select * from name`, [], {
            resultSet: true,
            outFormat: oracledb.OUT_FORMAT_OBJECT,
        });

        const rs = result.resultSet;
        let row;

        while ((row = await rs.getRow())) {
            console.log(row.TIME);
            var d = new Date(row.TIME);
            console.log(d.toDateString());
            //console.log(row.NAME, row.TIME);
            //   if (row.DONE)
            //     console.log(row.DESCRIPTION, "is done");
            //   else
            //     console.log(row.DESCRIPTION, "is NOT done");
        }

        await rs.close();
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}

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

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

const getItems = async () => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        let result = await connection.execute(
            `select * from food_product`,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        const rs = result.resultSet;
        let temp = [];
        let row;
        while ((row = await rs.getRow())) {
            result = await connection.execute(
                `select name from food_supply where supply_id=${row.SUPPLY_ID}`,
                [],
                {
                    resultSet: true,
                    outFormat: oracledb.OUT_FORMAT_OBJECT,
                }
            );
            let res = result.resultSet;
            let temp_name;
            let rows;
            while ((rows = await res.getRow())) {
                temp_name = rows.NAME;
            }
            row.SUPPLY_NAME = temp_name;
            temp.push(row);
        }
        await rs.close();
        return temp;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const addItems = async (data, supply_id) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");
        let result = await connection.execute(
            `select max(food_id) as id from food_product `,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        let rs = result.resultSet;
        let temp_id = 0;
        let row;
        while ((row = await rs.getRow())) {
            temp_id = row.ID + 1;
        }
        await rs.close();
        sql = `insert into food_product values(${temp_id}, '${data.name}', '${data.description}','${data.price}', ${supply_id})`;

        result = await connection.execute(sql);

        console.log(result.rowsAffected, "Rows Inserted");

        connection.commit();
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const getSupplyItems = async (supply_id) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        let result = await connection.execute(
            `select * from food_product where supply_id=${supply_id}`,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        const rs = result.resultSet;
        let temp = [];
        let row;
        while ((row = await rs.getRow())) {
            temp.push(row);
        }
        await rs.close();
        return temp;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const getOrders = async (cust_id) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        let result = await connection.execute(
            `select customer.name as cust_name,customer.contact_num as phno,customer.address as cust_address,food_product.name as food_name,food_supply.name as supply_name,food_supply.address as supply_address,delivery.quantity as food_quantity,delivery.payment as payment,delivery.delivery_date as order_date,transaction_reports.time as  order_time  from delivery,food_supply,food_product,customer,transaction_reports where transaction_reports.cust_id = ${cust_id} and transaction_reports.delivery_id=delivery.delivery_id and transaction_reports.supply_id=food_supply.supply_id and transaction_reports.cust_id = customer.cust_id and food_product.food_id = transaction_reports.food_id`,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );
        const rs = result.resultSet;
        let temp = [];
        let rows;
        while ((rows = await rs.getRow())) {
            temp.push({
                cust_name: rows.CUST_NAME,
                phno: rows.PHNO,
                cust_address: rows.CUST_ADDRESS,
                food_name: rows.FOOD_NAME,
                supply_name: rows.SUPPLY_NAME,
                supply_address: rows.SUPPLY_ADDRESS,
                quantity: rows.FOOD_QUANTITY,
                payment: rows.PAYMENT,
                date: rows.ORDER_DATE,
                time: rows.ORDER_TIME,
            });
        }
        await rs.close();
        return temp;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const getRequests = async (supply_id) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        let result = await connection.execute(
            `select customer.name as cust_name,customer.contact_num as phno,customer.address as cust_address,food_product.name as food_name,food_supply.name as supply_name,food_supply.address as supply_address,delivery.quantity as food_quantity,delivery.payment as payment,delivery.delivery_date as order_date,transaction_reports.time as  order_time  from delivery,food_supply,food_product,customer,transaction_reports where transaction_reports.supply_id = ${supply_id} and transaction_reports.delivery_id=delivery.delivery_id and transaction_reports.supply_id=food_supply.supply_id and transaction_reports.cust_id = customer.cust_id and food_product.food_id = transaction_reports.food_id`,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );
        const rs = result.resultSet;
        let temp = [];
        let rows;
        while ((rows = await rs.getRow())) {
            temp.push({
                cust_name: rows.CUST_NAME,
                phno: rows.PHNO,
                cust_address: rows.CUST_ADDRESS,
                food_name: rows.FOOD_NAME,
                supply_name: rows.SUPPLY_NAME,
                supply_address: rows.SUPPLY_ADDRESS,
                quantity: rows.FOOD_QUANTITY,
                payment: rows.PAYMENT,
                date: rows.ORDER_DATE,
                time: rows.ORDER_TIME,
            });
        }
        await rs.close();
        return temp;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const setCustomer = async (data) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        let result = await connection.execute(
            `select max(cust_id) as id from customer `,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        const rs = result.resultSet;
        let temp_id = 0;
        let row;
        while ((row = await rs.getRow())) {
            temp_id = row.ID + 1;
        }
        await rs.close();
        console.log(temp_id);
        console.log(data);
        const sql = `insert into customer values(${temp_id},'${data.name}','${data.number}','${data.address}')`;

        result = await connection.execute(sql);

        console.log(result.rowsAffected, "Rows Inserted");

        connection.commit();
        return temp_id;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const setSupplier = async (data) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");

        let result = await connection.execute(
            `select max(supply_id) as id from food_supply `,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        const rs = result.resultSet;
        let temp_id = 0;
        let row;
        while ((row = await rs.getRow())) {
            temp_id = row.ID + 1;
        }
        await rs.close();
        console.log(temp_id);
        console.log(data);
        const sql = `insert into food_supply values(${temp_id},'${data.name}','${data.address}')`;

        result = await connection.execute(sql);

        console.log(result.rowsAffected, "Rows Inserted");

        connection.commit();
        return temp_id;
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

const submitOrder = async (cust_id, data) => {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "nodelock",
            password: "SYS",
            connectString: "localhost/XEXDB",
        });

        console.log("Successfully connected to Oracle Database");
        let sql = `insert into delivery values(:1, :2, :3, :4, :5, :6)`;
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

        let result = await connection.execute(
            `select max(delivery_id) as id from delivery `,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        let rs = result.resultSet;
        let temp_delivery_id = 0;
        let row;
        while ((row = await rs.getRow())) {
            temp_delivery_id = row.ID + 1;
        }
        await rs.close();

        // to get temporary order id
        result = await connection.execute(
            `select max(order_id) as id from order_details `,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        rs = result.resultSet;
        let temp_order_id = 0;
        while ((row = await rs.getRow())) {
            temp_order_id = row.ID + 1;
        }
        await rs.close();

        // to get temporary transactional report id
        result = await connection.execute(
            `select max(order_id) as id from transaction_reports `,
            [],
            {
                resultSet: true,
                outFormat: oracledb.OUT_FORMAT_OBJECT,
            }
        );

        rs = result.resultSet;
        let temp_transaction_id = 0;
        while ((row = await rs.getRow())) {
            temp_transaction_id = row.ID + 1;
        }
        await rs.close();

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

        result = await connection.executeMany(sql, rows);

        console.log(result.rowsAffected, "Rows Inserted");

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

        sql = `insert into order_details values(:1, :2, :3, :4, :5, :6)`;

        result = await connection.executeMany(sql, order_rows);

        console.log(result.rowsAffected, "Rows Inserted");

        console.log(report_rows);

        sql = `insert into transaction_reports values(:1, :2, :3,:4, :5, :6,:7)`;

        result = await connection.executeMany(sql, report_rows);

        console.log(result.rowsAffected, "Rows Inserted");

        connection.commit();
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};
