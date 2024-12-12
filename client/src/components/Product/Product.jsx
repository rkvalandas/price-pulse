import React from "react";
import { useLocation, Link } from "react-router-dom";
import SetAlert from "../Alerts/SetAlert";

export default function Product() {
  const location = useLocation();
  const user = location.state?.user;
  const productData = location.state?.data.product;

  if (!productData) {
    return (
      <div>
        <h2>No Product Data</h2>
        <p>Please go back and search for a product.</p>
        <Link to="/">
          <button className="btn btn-primary">Go Back</button>
        </Link>
      </div>
    );
  }

  const {
    productTitle,
    productImageUrl,
    productPrice,
    productUrl,
    productGraph,
    productSpecs,
    productDescription,
  } = productData;
  const encodedGraph = encodeURIComponent(productGraph);

  return (
    <div className="container mx-auto bg-base-100 mt-24 flex justify-center">
  <div className="w-full max-w-4xl flex flex-col rounded-lg p-2 mt-14">
    <div className="flex justify-center bg-base-200 rounded-3xl w-full">
      <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:gap-8 p-5 text-center md:text-left w-full">
        <img
          src={productImageUrl}
          alt="Product"
          className="max-w-xs rounded-3xl shadow-lg m-3"
        />
        <div>
          <h1 className="text-2xl font-bold mb-4 mt-3">{productTitle}</h1>
          <p className="text-xl mb-10 mt-6">
            <b>Price: </b> <span>&#8377;</span> 
            {productPrice || "N/A"}
          </p>
          <div className="flex justify-center">
            <a href={productUrl} target="_blank" rel="noopener noreferrer">
              <button className="btn btn-primary w-36 rounded-3xl mr-3">
                Buy Now
              </button>
            </a>
            <SetAlert user = {user} productTitle={productTitle} productPrice={productPrice} productUrl={productUrl}/>
          </div>
        </div>
      </div>
    </div>
    <h2 className="text-xl mt-8 text-center">
      <strong>Price History of the product</strong>
    </h2>
    <iframe
      className="rounded-2xl mt-5 mx-auto"
      src={`https://pricehistoryapp.com/embed/${encodedGraph}`}
      width="100%"
      height="450"
    ></iframe>

    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Specifications:</h3>
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: productSpecs || "N/A" }}
      ></div>
    </div>

    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Description:</h3>
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{ __html: productDescription || "N/A" }}
      ></div>
    </div>
  </div>
</div>

  );
}
