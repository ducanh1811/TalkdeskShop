import styles from "./foryou.module.scss";
import classname from "classnames/bind";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "animate.css";

import { Carousel, Image, Progress } from "antd";
import { render } from "@testing-library/react";

const numeral = require("numeral");
const cx = classname.bind(styles);
function ForYou() {

  var category = JSON.parse(localStorage.getItem("mycategory"))||[];

  var url =
    "https://backoffice.nodemy.vn/api/products?pagination[page]=1&pagination[pageSize]=4&sort[0]=price%3Aasc&sort[1]=name%3Aasc&";
  var [foryous, setforyous] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(url + `filters[idCategories][slug][$in][0]=${category[0]}&filters[idCategories][slug][$in][1]=${category[1]}&filters[idCategories][slug][$in][2]=${category[2]}`)
      .then((res) => {
        setforyous(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function GetCoupon(price, priceSale) {
    var coupon = 100 - Math.floor((price / priceSale) * 100);
    return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
  }


  function Itemforyou(props) {
    const { item, index } = props;
    const restAPI = "https://backoffice.nodemy.vn";

    var [data, setData] = useState([]);    

    useEffect(() => {
        axios.get(restAPI + '/api/products/' + item.attributes.slug + '?populate=*')
            .then((res) => {
                setData(res.data.data.attributes);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    return (
  
        <div
          key={index}
          onMouseEnter={(e) => {
            e.currentTarget.childNodes[0].style.transform = "scale(1.1)";
            e.currentTarget.childNodes[1].childNodes[0].style.color = "#288ad6";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.childNodes[0].style.transform = "scale(1.0)";
            e.currentTarget.childNodes[1].childNodes[0].style.color = "#000";
          }}
          onClick={() => navigate(`/detail/${data.slug}`)}
          className={cx("item-foryou")}
        >
          <Image
            height="200px"
            style={{
              width: "98%",
            }}
            transition="12s easing"
            preview={false}
            src={restAPI + data.image?.data[0].attributes.url}
          />
          <div className={cx("item-content")}>
            <div className={cx("item-content__title")}>
              {data.name}
            </div>
            <div className={cx("item-content__price")}>
              <div className={cx("price__new")}>
                {numeral(data.price).format("0,0")}
                <span>đ</span>
              </div>
              <div className={cx("price__old")}>
                <div className={cx("price")}>
                  {numeral(data.oldPrice).format("0,0") + "đ"}
                </div>
                <div className={cx("sale")}>
                  {GetCoupon(data.price, data.oldPrice)}
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Progress
                percent={
                  (Math.floor(20 - data.quantityAvailable) * 100) /
                  20
                }
                format={(percent) => `${(percent * 20) / 100}/20`}
                status="active"
                showInfo={false}
                strokeWidth={25}
                style={{
                  marginTop: "5%",
                  width: "200px",
                  opacity: "0.8",
                }}
                strokeColor={{
                  "0%": "yellow",
                  "100%": "red",
                }}
                trailColor="#dddddd"
              />
              <div
                style={{
                  position: "absolute",
                  top: "55%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "black",
                  fontWeight: "100",
                  fontSize: "0.8rem",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                {`Đã bán ${20 - data.quantityAvailable}/20`}
              </div>
            </div>
          </div>
        </div>
    );
  }

  function GetListforyou() {
    //const { foryous } = props;
    var listforyou = [];
    var listforyouTemp = [];
    foryous.map((item, index) => {
      if (index % 4 === 0 && index !== 0) {
        listforyou.push(listforyouTemp);
        listforyouTemp = [];
      }
      listforyouTemp.push(item);
    });
    listforyou.push(listforyouTemp);
    return listforyou;
  }

  return (
    <>
      <div className={cx("foryou-current")}>
        <div className={cx("foryou-current__title")}>
          <h2 className={cx("foryou-current__text_1")}>GỢI Ý HÔM NAY</h2>
          <h2 className={cx("foryou-current__text_2")}>DÀNH CHO BẠN</h2>
        </div>
        <div className={cx("foryou-current__content")}>
         
            {GetListforyou().map((item, index) => {
              return (
                <div key={index} className={cx("content")}>
                    {item.map((item, index) => {
                      return <Itemforyou key={index} item={item} />;
                    })}
                </div>
              );
            })}

        </div>
      </div>
    </>
  );
}
export default ForYou;
