export default function AddTaskModal({ isOpen, onClose, form, handleChange, handleCreate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-indigo-700">📝 Thêm công việc mới</h3>

        <form onSubmit={handleCreate} className="space-y-3">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề"
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-indigo-400"
            required
          />

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-indigo-400"
          >
            <option value="low">Ưu tiên thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Ưu tiên cao</option>
          </select>

          <input
            type="date"
            name="scheduledDate"
            value={form.scheduledDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-indigo-400"
            required
          />

          <div className="flex gap-4">
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-indigo-400"
              required
            />
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring focus:border-indigo-400"
              placeholder="Phút"
              min="1"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-500 text-white hover:bg-indigo-600"
            >
              Thêm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
