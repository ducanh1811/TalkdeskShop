import styles from "./search.module.scss";
import classname from "classnames/bind"; // thay đổi đường import và tên biến

import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import Tippy from "@tippyjs/react";

import { Input, Image } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import _debounce from "lodash/debounce";
const numeral = require("numeral");
function Search() {
  const cx = classname.bind(styles);
  const [dulieu, setDulieu] = useState([]);
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  function handleDebounceFn(inputValue) {
    setValue(inputValue);
  }

  const debounceFn = useCallback(_debounce(handleDebounceFn, 500), []);

  function handleChange(event) {
    const inputValue = event.target?.value;
    debounceFn(inputValue);
  }

  useEffect(() => {
    axios
      .get(
        `https://backoffice.nodemy.vn/api/products?populate=*&filters[name][$contains]=${value}`
      )
      .then((res) => {
        setDulieu(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [value]);

  const restAPI = "https://backoffice.nodemy.vn";
  return (
    <>
      <Tippy
        visible={value.length > 0}
        interactive
        onClickOutside={() => {
          setValue("");
        }}
        render={
          value.length > 0
            ? (attrs) => (
                <div className={cx("search-dropdown")} tabIndex={-1} {...attrs}>
                  {" "}
                  {dulieu.map((item, index) => {
                    return (
                      <div key={index} onClick={() => {
                        setValue("");
                        navigate(`/detail/${item.attributes.slug}`)
                      }} className={cx("search-dropdown-item")}>
                        <Image
                          width="40%"
                          style={{
                            objectFit: "cover",
                            borderRadius: "10px",
                            margin: "1.5% 0",
                          }}
                          preview={false}
                          src={
                            restAPI +
                            item.attributes.image?.data[0].attributes.url
                          }
                        />
                        <div className={cx("content")}>
                          <div className={cx("name")}>
                            {item.attributes.name}{" "}
                          </div>
                          <div className={cx("price")}>
                            {numeral(item.attributes.price).format("0,0")}
                            <span>đ</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            : null
        }
      >
        <div
          style={{
            width: "40%",
          }}
        >
          <Input
            placeholder="Bạn muốn tìm gì?"
            style={{
              width: "100%",
            }}
            onChange={handleChange}
          />
        </div>
      </Tippy>
    </>
  );
}
export default Search;
