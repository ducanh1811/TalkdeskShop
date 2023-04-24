import styles from "./hotpromotion.module.scss";
import classname from "classnames/bind";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "animate.css";

import { Carousel, Image, Progress } from "antd";
import { render } from "@testing-library/react";

const numeral = require("numeral");
const cx = classname.bind(styles);
function HotPromotion() {
  var [hots, setHots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://backoffice.nodemy.vn/api/products?populate=*")
      .then((res) => {
        setHots(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function GetListGift() {
    //const { hots } = props;
    var listGift = [];
    var listGiftTemp = [];
    hots.map((item, index) => {
      if (index % 4 === 0 && index !== 0) {
        listGift.push(listGiftTemp);
        listGiftTemp = [];
      }
      listGiftTemp.push(item);
    });
    listGift.push(listGiftTemp);
    return listGift;
  }

  function GetCoupon(price, priceSale) {
    var coupon = 100 - Math.floor((price / priceSale) * 100);
    return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
  }

  function HotPromotion(props) {
    const { item, index } = props;
    const restAPI = "https://backoffice.nodemy.vn";
    return (
      <>
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
          onClick={() => navigate(`/detail/${item.attributes.slug}`)}
          className={cx("item-gift")}
        >
          <Image
            height="200px"
            style={{
              backgroundColor: "red",
              width: "98%",
            }}
            transition="12s easing"
            preview={false}
            src={
              item.attributes.image?.data
                ? restAPI + item.attributes.image.data[0].attributes.url
                : "https://backoffice.nodemy.vn/uploads/laptop_gaming_acer_nitro_5_eagle_an515_57_5669_a1581d79b72e45239cf8ffaad2c866f4_large_a7ac93dab2.webp"
            }
          />
          <div className={cx("item-content")}>
            <div className={cx("item-content__title")}>
              {item.attributes.name}
            </div>
            <div className={cx("item-content__price")}>
              <div className={cx("price__new")}>
                {numeral(item.attributes.price).format("0,0")}
                <span>đ</span>
              </div>
              <div className={cx("price__old")}>
                <div className={cx("price")}>
                  {numeral(item.attributes.oldPrice).format("0,0") + "đ"}
                </div>
                <div className={cx("sale")}>
                  {GetCoupon(item.attributes.price, item.attributes.oldPrice)}
                </div>
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <Progress
                percent={
                  (Math.floor(20 - item.attributes.quantityAvailable) * 100) /
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
                {`Đã bán ${20 - item.attributes.quantityAvailable}/20`}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cx("hotpromotion")}>
        <Image
          preview={false}
          style={{
            width: "89vw",
          }}
          src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/04/banner/TGDD--Desk--deal-ngon-1200x120.png"
        />
        <div className={cx("hotpromotion__content")}>
          <div className={cx("hotpromotion__wrapper")}>
            <Carousel autoplay>
              {GetListGift().map((item, index) => {
                return (
                  <>
                    <div key={index} className={cx("content")}>
                      {item.map((item, index) => {
                        return <HotPromotion item={item} index={index} />;
                      })}
                    </div>
                  </>
                );
              })}
            </Carousel>
          </div>
        </div>
      </div>
    </>
  );
}
export default HotPromotion;