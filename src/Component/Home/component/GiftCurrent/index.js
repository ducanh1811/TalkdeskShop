import styles from "./giftcurrent.module.scss";
import classname from "classnames/bind";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "animate.css";

import { Carousel, Image, Progress } from "antd";
import { render } from "@testing-library/react";

const numeral = require("numeral");
const cx = classname.bind(styles);
function GiftCurrent() {
  var [gifts, setGifts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://backoffice.nodemy.vn/api/products?populate=*")
      .then((res) => {
        setGifts(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  function GetCoupon(price, priceSale) {
    var coupon = 100 - Math.floor((price / priceSale) * 100);
    return coupon < 0 ? `+${Math.abs(coupon)}%` : `-${Math.abs(coupon)}%`;
  }

  function RestTime(props) {
    const { rest } = props;
    const [countdown, setCountdown] = useState(null);
    useEffect(() => {
      // Thiết lập thời gian kết thúc đếm ngược
      const countDownDate = new Date("NOV 1, 2024 16:37:25").getTime();

      // Cập nhật đồng hồ đếm ngược mỗi 1 giây
      const x = setInterval(() => {
        // Lấy thời gian hiện tại
        const now = new Date().getTime();

        // Tính thời gian còn lại giữa thời gian hiện tại và thời gian kết thúc đếm ngược
        const distance = countDownDate - now;

        // Tính toán thời gian cho giờ, phút và giây
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị đồng hồ đếm ngược
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);

        // Nếu đếm ngược kết thúc, dừng cập nhật
        if (distance < 0) {
          clearInterval(x);
          setCountdown("Đếm ngược đã kết thúc");
        }
      }, 1000);

      // Clear interval khi component unmount
      return () => clearInterval(x);
    }, []);
    return (
      <>
        <div className={cx("gift-current__time")}>
          <p className={cx("gift-current__time__title")}>Kết thúc sau</p>
          <p className={cx("gift-current__time__title")}>{countdown}</p>
        </div>
      </>
    );
  }
  function ItemGift(props) {
    const { item, index } = props;
    const restAPI = "https://backoffice.nodemy.vn";
    // console.log("AAAAAA" + restAPI + item.attributes.image?.data[0].attributes.url);
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
                : "https://backoffice.nodemy.vn/uploads/r5_3050_1ca8d2e294ca4a3c8c875ac518beb714_large_4c8a4d705f.webp"
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

  function GetListGift() {
    //const { gifts } = props;
    var listGift = [];
    var listGiftTemp = [];
    gifts.map((item, index) => {
      if (index % 4 === 0 && index !== 0) {
        listGift.push(listGiftTemp);
        listGiftTemp = [];
      }
      listGiftTemp.push(item);
    });
    listGift.push(listGiftTemp);
    return listGift;
  }

  return (
    <>
      <div className={cx("gift-current")}>
        <div className={cx("gift-current__title")}>
          <h2 className={cx("gift-current__text")}>QUÀ TẶNG ĐANG DIỄN RA</h2>
          <RestTime rest={30} />
        </div>
        <div className={cx("gift-current__content")}>
          <Carousel autoplay>
            {GetListGift().map((item, index) => {
              return (
                <div key={index}>
                  <div className={cx("content")}>
                    {item.map((item, index) => {
                      return <ItemGift item={item} index={index} />;
                    })}
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </>
  );
}
export default GiftCurrent;
