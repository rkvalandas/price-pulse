import React from "react";
import { useLocation, Link } from "react-router-dom";
import SetAlert from "../Alerts/SetAlert";

export default function Product() {
  const location = useLocation();
  const user = location.state?.user;
  const productData = location.state?.data.product;

  if (!productData) {
    return (
      <div className="text-center p-8 mt-24">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          No Product Data
        </h2>
        <p className="mb-4 dark:text-gray-300">
          Please go back and search for a product.
        </p>
        <Link to="/">
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg">
            Go Back
          </button>
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
    <div className="mx-auto bg-white dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col rounded-xl p-2 mt-14">
        <div className="flex justify-center bg-gray-100 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-lg w-full">
          <div className="flex flex-col md:flex-row items-center justify-center md:items-center md:gap-8 p-5 text-center md:text-left w-full">
            <img
              src={productImageUrl}
              alt="Product"
              className="max-w-xs rounded-xl shadow-lg m-3"
            />
            <div>
              <h1 className="text-2xl font-bold mb-4 mt-3 dark:text-white">{productTitle}</h1>
              <p className="text-xl mb-10 mt-6 dark:text-gray-200">
                <b>Price: </b> <span>&#8377;</span>
                {productPrice || "N/A"}
              </p>
              <div className="flex justify-center">
                <a href={productUrl} target="_blank" rel="noopener noreferrer">
                  <button className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-medium w-36 rounded-xl mr-3">
                    Buy Now
                  </button>
                </a>
                <SetAlert
                  user={user}
                  productTitle={productTitle}
                  productPrice={productPrice}
                  productUrl={productUrl}
                />
              </div>
            </div>
          </div>
        </div>
        <h2 className="text-xl mt-8 text-center dark:text-white">
          <strong>Price History of the product</strong>
        </h2>
        <iframe
          className="rounded-xl mt-5 mx-auto border border-gray-200 dark:border-gray-600"
          src={`https://pricehistoryapp.com/embed/${encodedGraph}`}
          width="100%"
          height="450"
        ></iframe>

        <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Specifications:</h3>
          <div
            className="text-sm dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: productSpecs || "N/A" }}
          ></div>
        </div>

        <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-md mb-8">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">Description:</h3>
          <div
            className="text-sm dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: productDescription || "N/A" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
