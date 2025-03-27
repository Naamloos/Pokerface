import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface ModInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    mod: Mod | null;
}

const ModInfoModal: React.FC<ModInfoModalProps> = ({ isOpen, onClose, mod }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !mod) return null;

    return (
        <div className="fixed inset-0 bg-base bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#162325] rounded-md shadow-lg p-4 max-w-3xl mx-auto my-4" ref={modalRef}>
                <h2 className="text-xl text-white mb-2">{mod.title}</h2>
                <div className="flex">
                    {mod.imageB64 && (
                        <img
                            src={`data:image/jpg;base64,${mod.imageB64}`}
                            alt={`Thumbnail for ${mod.title}`}
                            className="mb-2 rounded-md w-2/5 object-cover h-52 mr-4"
                        />
                    )}
                    <div className="text-gray-300 mb-2 border-b border-t border-gray-600 py-2 max-h-52 overflow-y-auto pr-2 scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent relative w-2/3">
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-xl text-white mb-4" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-lg text-white mb-3" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-md text-white mb-2" {...props} />,
                                h4: ({ node, ...props }) => <h4 className="text-sm text-white mb-1" {...props} />,
                                strong: ({ node, ...props }) => <span className="text-red-500" {...props} />,
                                a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" {...props} />,
                            }}
                        >
                            {mod.description || ""}
                        </ReactMarkdown>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300 text-md">
                    <div><strong>Author:</strong> {mod.author}</div>
                    {mod.version && <div><strong>Version:</strong> {mod.version}</div>}
                    <div><strong>Categories:</strong> {mod.categories.join(", ") || "N/A"}</div>
                    {mod["automatic-version-check"] !== undefined && (
                        <div><strong>Auto-Update:</strong> {mod["automatic-version-check"] ? "Yes" : "No"}</div>
                    )}
                    {mod.folderName && <div><strong>Folder:</strong> {mod.folderName}</div>}
                    <div><strong>Steamodded:</strong> {mod["requires-steamodded"] ? "Yes" : "No"}</div>
                    <div><strong>Talisman:</strong> {mod["requires-talisman"] ? "Yes" : "No"}</div>
                </div>
                <p className="text-sm">
                    {mod.repo && <div><strong>Repo:</strong> {mod.repo}</div>}
                    {mod.downloadURL && <div><strong>Download:</strong> {mod.downloadURL}</div>}
                </p>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 w-full mt-4"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ModInfoModal;
