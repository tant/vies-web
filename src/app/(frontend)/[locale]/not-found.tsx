import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Không tìm thấy trang</h2>
          <p className="text-gray-600 mb-8">Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/vi" className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            Về trang chủ
          </Link>
          <Link href="/vi/products" className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors border">
            Xem sản phẩm
          </Link>
        </div>
      </div>
    </div>
  )
}
