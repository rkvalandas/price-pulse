import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchProduct } from "../../api";
import backgroundImage from "../../assets/background.jpeg";

export default function Home() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await searchProduct(url); // Call the helper function

      // Redirect to Product Page with product data
      navigate("/product", { state: { data, user: data.user } });
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <div className="w-full">
      {/* Main Hero Section */}
      <section
        className="hero bg-base-100 min-h-screen bg-opacity-1"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="hero-content text-center">
          <div className="max-w-full min-w-72 w-full">
            <h1 className="text-4xl font-bold mb-4 text-white [text-shadow:_0_2px_0_rgb(0_0_0_/_900%)]">
              Track Product Prices
            </h1>
            <p className="text-lg mb-8 text-white [text-shadow:_0_1px_0_rgb(0_0_0_/_100%)]">
              Find the best deals and track the price history of your favorite
              products.
            </p>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-wrap justify-center items-center space-x-4"
            >
              <label className="input input-bordered flex items-center gap-2 rounded-2xl h-12 shadow shadow-gray-500">
                <input
                  type="text"
                  className="grow"
                  placeholder="Search"
                  value={url}
                  onChange={handleSearchChange}
                />
              </label>
              <button
                type="submit"
                className="h-12 w-24 font-semibold bg-teal-400 shadow-sm border border-teal-700 hover:bg-teal-500 hover:transition-colors text-black shadow-gray-600 m-2 rounded-2xl"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <p className="text-lg">Check out some of the most popular products</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {/* Product Cards */}
          {[
            {
              id: 1,
              title: "Apple iPhone 15",
              price: "79990",
              img: "https://www.imagineonline.store/cdn/shop/files/iPhone_16_Pink_PDP_Image_Position_1__en-IN_4dccfc5a-39a9-4652-9c28-825d511fb1ee.jpg?v=1727247691&width=1445",
              link: "/",
            },
            {
              id: 2,
              title: "Samsung Galaxy S23",
              price: "79999",
              img: "https://m.media-amazon.com/images/I/71IfBk7ET0L.jpg",
              link: "/",
            },
            {
              id: 3,
              title: "Sony Noise Headphones",
              price: "59999",
              img: "https://www.theaudiostore.in/cdn/shop/files/SonyWH-CH720NNoise-CancelingWirelessHeadphonesblack01.webp?v=1720809973",
              link: "/",
            },
          ].map((product) => (
            <div
              key={product.id}
              className="flex flex-col card card-compact h-[450px] w-[310px] bg-base-300 shadow-3xl rounded-3xl overflow-hidden"
            >
              <figure className="flex justify-center items-center mt-2 mx-2 border border-base-300 rounded-2xl overflow-hidden">
                <img
                  src={product.img}
                  alt={product.title}
                  className="object-cover w-full"
                />
              </figure>
              <div className="flex flex-col justify-between border border-base-300 rounded-2xl m-2 bg-base-100 p-4 h-36">
                <h5
                  className="text-base font-semibold truncate mb-2"
                  title={product.title}
                >
                  {product.title}
                </h5>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">Price: <span>&#8377;</span> 
                  {product.price}</p>
                  <Link to={product.link}>
                    <button className="h-10 w-24 font-semibold bg-emerald-400 shadow-sm border border-teal-700 hover:bg-teal-500 transition-colors text-black m-1 rounded-2xl">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
