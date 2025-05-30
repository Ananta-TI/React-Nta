import PageHeader from "../components/PageHeader";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductDetail from "./ProductDetail";

export default function Products() {
  const breadcrumb = ["Dashboard", "Product List"];
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      axios
        .get(`https://dummyjson.com/products/search?q=${query}`)
        .then((response) => {
          if (response.status !== 200) {
            setError(response.data.message);
            return;
          }
          setProducts(response.data.products);
          setError(null);
        })
        .catch((err) => {
          setError(err.message || "An unknown error occurred");
        });
    }, 500); // delay pencarian 500ms

    return () => clearTimeout(timeout);
  }, [query]);

  const errorInfo = error ? (
    <div className="bg-red-200 mb-5 p-5 text-sm font-light text-gray-600 rounded flex items-center">
      <BsFillExclamationDiamondFill className="text-red-600 me-2 text-lg" />
      {error}
    </div>
  ) : null;

  return (
    <div>
      <PageHeader title="Products" breadcrumb={breadcrumb} />

      {errorInfo}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari produk..."
        className="mb-4 p-3 w-full bg-white rounded-2xl shadow-lg"
      />

      <table className="min-w-full divide-y divide-gray-200 overflow-hidden rounded-2xl shadow-lg">
        <thead>
          <tr className="bg-emerald-600 text-white text-left text-sm font-semibold">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Vendor</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 text-sm text-gray-800">
          {products.map((item, index) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="px-6 py-4">
  <a
    href={`/products/${item.id}`}
    className="text-emerald-400 hover:text-emerald-500"
  >
    {item.title}
  </a>
</td>
<td className="px-6 py-4">{item.category}</td>

              <td className="px-6 py-4">{item.category}</td>
              <td className="px-6 py-4">Rp {item.price * 1000}</td>
              <td className="px-6 py-4">{item.brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
