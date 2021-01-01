require("dotenv").config();
import request from "request";



function insertDB(array) {

    const { Pool, Client } = require("pg");

    const connectionString = process.env.URI;

    const pool = new Pool({
        connectionString,
        ssl: {
            rejectUnauthorized: false
        }
    });

    var newArray = array.slice(8, 13);

    var doi_tuong = array[0];
    var ho_ten = array[1];
    var ngay_sinh = array[2];
    var so_can_cuoc = array[3];
    var que_quan = array[4];
    var so_dien_thoai = array[5];
    var muc_do = array[6];
    var vi_tri = array[7];
    var can_ho_tro = newArray.join();
    var so_luong_nguoi = array[13];
    var so_nguoi_bi_thuong = array[14];
    var thiet_hai = array[15];
    var cho_phep = array[16]
    var thong_tin_them = array[17];
    var queryString = ` Insert into info_collected (Doi_tuong,Ho_ten,Ngay_sinh,So_can_cuoc,Que_quan,So_dien_thoai,Muc_do,Vi_tri,Can_ho_tro,So_luong_nguoi,Nguoi_bi_thuong,Thiet_hai,Cho_phep,Thong_tin_them) 
        values ('${doi_tuong}','${ho_ten}','${ngay_sinh}','${so_can_cuoc}','${que_quan}','${so_dien_thoai}','${muc_do}','${vi_tri}','${can_ho_tro}','${so_luong_nguoi}','${so_nguoi_bi_thuong}','${thiet_hai}','${cho_phep}','${thong_tin_them}')`
    pool.query(queryString, (err, res) => {
        console.log(err, res);
        pool.end()
    })
}
module.exports = {
    insertDB:insertDB,
};