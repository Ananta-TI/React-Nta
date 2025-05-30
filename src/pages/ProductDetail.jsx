import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`https://dummyjson.com/products/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          setError(response.message);
          return;
        }
        setProduct(response.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id]);

  const formatRupiah = (angka) =>
    angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });

  if (error) return <div className="text-red-600 p-4">{error}</div>;
  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            src={product.thumbnail}
            alt={product.title}
            className="rounded-2xl  object-cover mb-4"
          />
          {product.images && product.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`img-${i}`}
                  className="w-16 h-16 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-emerald-700 mb-3">
            {product.title}
          </h2>

          <div className="flex flex-wrap gap-2 text-sm mb-4">
            <span className="bg-emerald-100  text-emerald-700 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Brand: {product.brand}
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
              ⭐ {product.rating}
            </span>
            <span
              className={`${
                product.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              } px-3 py-1 rounded-full`}
            >
              {product.availabilityStatus}
            </span>
          </div>

          <p className="text-gray-700 mb-4">{product.description}</p>

          <div className="text-gray-600 text-sm space-y-1 mb-4">
            <p>SKU: {product.sku}</p>
            <p>Berat: {product.weight} gram</p>
            <p>
              Dimensi: {product.dimensions.width} x {product.dimensions.height} x{" "}
              {product.dimensions.depth} cm
            </p>
            <p>Pengiriman: {product.shippingInformation}</p>
            <p>Garansi: {product.warrantyInformation}</p>
            <p>Kebijakan retur: {product.returnPolicy}</p>
            <p>Min. Pembelian: {product.minimumOrderQuantity}</p>
            <p>Barcode: {product.meta?.barcode}</p>
          </div>

          {product.tags?.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-1">Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 text-2xl font-bold text-emerald-700">
            {product.discountPercentage ? (
              <>
                <span className="line-through text-gray-400 mr-2">
                  {formatRupiah(product.price * 1000)}
                </span>
                <span className="text-red-600">
                  {formatRupiah(
                    product.price * 1000 *
                      (1 - product.discountPercentage / 100)
                  )}
                </span>
                <span className="ml-2 text-sm text-red-500 bg-red-100 px-2 py-0.5 rounded-full">
                  -{product.discountPercentage}%
                </span>
              </>
            ) : (
              <>{formatRupiah(product.price * 1000)}</>
            )}
          </div>

          {product.meta?.qrCode && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">QR Code:</p>
              <img
                src={product.meta.qrCode}
                alt="QR Code"
                className="w-28 h-28"
              />
            </div>
          )}
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Ulasan Produk</h3>
          <div className="space-y-4">
            {product.reviews.map((review, i) => (
              <div
                key={i}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">{review.reviewerName}</span>
                  <span className="text-yellow-500">⭐ {review.rating}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-400">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
