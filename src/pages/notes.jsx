import { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/24/solid";

import AlertBox from "../components/AlertBox";
import GenericTable from "../components/GenericTable";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { notesAPI } from "../services/notesAPI";

export default function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [dataForm, setDataForm] = useState({
        title: "",
        content: "",
        status: "",
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataForm((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await notesAPI.fetchNotes();
            setNotes(data);
        } catch (err) {
            setError("Gagal memuat catatan");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            if (isEditMode) {
                await notesAPI.updateNote(editId, dataForm);
                setSuccess("Catatan berhasil diperbarui!");
            } else {
                await notesAPI.createNote({ ...dataForm, status: dataForm.status || "pending" });
                setSuccess("Catatan berhasil ditambahkan!");
            }

            setDataForm({ title: "", content: "", status: "" });
            setIsEditMode(false);
            setEditId(null);

            setTimeout(() => setSuccess(""), 3000);
            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const konfirmasi = confirm("Yakin ingin menghapus catatan ini?");
        if (!konfirmasi) return;

        try {
            setLoading(true);
            setError("");
            await notesAPI.deleteNote(id);
            loadNotes();
        } catch (err) {
            setError(`Terjadi kesalahan: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (note) => {
        setIsEditMode(true);
        setEditId(note.id);
        setDataForm({
            title: note.title,
            content: note.content,
            status: note.status || "",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-10">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">📝 Notes App 2.0</h1>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 mb-10">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                    {isEditMode ? "Edit Catatan" : "Tambah Catatan"}
                </h2>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="title"
                        value={dataForm.title}
                        onChange={handleChange}
                        placeholder="Judul catatan..."
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 transition"

                    />
                    <textarea
                        name="content"
                        value={dataForm.content}
                        onChange={handleChange}
                        placeholder="Isi catatan..."
                        rows={3}
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 transition resize-none"
                    />
                    <select
                        name="status"
                        value={dataForm.status}
                        onChange={handleChange}
                        disabled={loading}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-emerald-500 transition"
                    >
                        <option value="">-- Pilih Status --</option>
                        <option value="pending">Pending</option>
                        <option value="done">Selesai</option>
                    </select>

                    {error && <AlertBox type="error">{error}</AlertBox>}
                    {success && <AlertBox type="success">{success}</AlertBox>}

                    <div className="flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md disabled:opacity-50"
                        >
                            {loading
                                ? isEditMode
                                    ? "Menyimpan perubahan..."
                                    : "Menyimpan..."
                                : isEditMode
                                    ? "Simpan Perubahan"
                                    : "Tambah Catatan"}
                        </button>
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditMode(false);
                                    setEditId(null);
                                    setDataForm({ title: "", content: "", status: "" });
                                }}
                                className="text-sm text-gray-500 underline"
                            >
                                Batal Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {!loading && notes.length > 0 && (
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        Daftar Catatan ({notes.length})
                    </h2>

                    <GenericTable
                        columns={["#", "Judul", "Isi", "Status", "Aksi"]}
                        data={notes}
                        renderRow={(note, index) => (
                            <>
                                <td className="px-4 py-3">{index + 1}</td>
                                <td className="px-4 py-3 font-semibold text-emerald-600">
                                    {note.title}
                                </td>
                                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                                    {note.content}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${note.status === "done"
                                                ? "bg-green-100 text-green-700"
                                                : note.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {note.status || "Belum diisi"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(note)}
                                        className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full"
                                        title="Edit Catatan"
                                    >
                                        <PencilIcon className="w-5 h-5 text-yellow-600" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(note.id)}
                                        className="p-2 bg-red-100 hover:bg-red-200 rounded-full"
                                        title="Hapus Catatan"
                                    >
                                        <TrashIcon className="w-5 h-5 text-red-600" />
                                    </button>
                                </td>
                            </>
                        )}

                    />
                </div>
            )}
        </div>
    );
}
