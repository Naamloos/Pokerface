import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";
import ModInfoModal from "../components/ModInfoModal";

const Home: React.FC = () => {
    const [mods, setMods] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMod, setSelectedMod] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isModalOpen]);

    const fetchMods = async (force?: boolean): Promise<void> => {
        // Simulate loading
        if (force || !await window.api.modfetcher.modlistExists()) {
            await window.api.modfetcher.refreshModList();
        }

        let loadedMods = await window.api.modfetcher.getModList();
        setMods(loadedMods);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchMods();
    }, []);

    const refresh = async (): Promise<void> => {
        setIsLoading(true);
        await fetchMods(true);
    };

    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    const filteredMods = mods.filter((mod) => {
        const searchTermLower = debouncedSearchTerm.toLowerCase();
        const titleLower = mod.title.toLowerCase();
        const categoriesLower = mod.categories.map(category => category.toLowerCase());

        if (debouncedSearchTerm === "") {
            return true; // Don't filter if search term is empty
        }

        const fuzzyMatch = (str: string, pattern: string): boolean => {
            pattern = pattern.split("").reduce((a, b) => a + ".*" + b);
            return (new RegExp(pattern)).test(str);
        }

        return fuzzyMatch(titleLower, searchTermLower) || categoriesLower.some(category => fuzzyMatch(category, searchTermLower));
    });

    const toggleModInstallation = (title: string): void => {
        setMods(
            mods.map((mod) =>
                mod.title === title ? { ...mod, installed: !mod.installed } : mod
            )
        );
    };

    const openModal = (mod: any): void => {
        setSelectedMod(mod);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setSelectedMod(null);
        setIsModalOpen(false);
    };

    console.log(mods);

    return (
        <MainLayout>
            <header className="sticky top-2 z-10 bg-[#162325] shadow-md p-4 mb-8 rounded-md border border-white/10">
                <div className="container mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-white">
                            Pokerface
                        </h1>
                        <p className="text-sm text-gray-300">
                            Just a Balatro mod manager
                        </p>
                        <p className="text-sm text-gray-300">
                            By Naamloos | Background: reactbits.dev | Font: m6x11 by Daniel Linssen.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search mods..."
                            className="p-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-darker text-white text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className="bg-blue-800 text-white px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer text-sm">
                            Launch Balatro
                        </button>
                        <button className="bg-blue-800 text-white px-3 py-1 rounded-md hover:bg-blue-700 cursor-pointer text-sm"
                            onClick={refresh}
                        >
                            Refresh Mods
                        </button>
                    </div>
                </div>
            </header>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMods.length > 0 ? (
                        filteredMods.map((mod) => (
                            <div
                                key={mod.title}
                                className="border rounded-md p-4 bg-base shadow-sm flex flex-col"
                            >
                                {!mod.imageB64 && (
                                    <div className="h-40 w-full bg-gray-700 rounded-md mb-4 flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                {mod.imageB64 && (
                                    <img
                                        src={`data:image/jpg;base64,${mod.imageB64}`}
                                        alt={`Thumbnail for ${mod.title}`}
                                        className="mb-4 rounded-md h-40 w-full object-cover"
                                    />
                                )}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-medium">
                                        {mod.title}
                                    </h3>
                                    {mod.version && (
                                        <span className="text-sm bg-gray-800 px-2 py-1 rounded-full">
                                            {mod.version}
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-400 mb-3">
                                    Categories: {mod.categories.join(", ")}
                                </p>
                                <p className="text-md text-gray-300 mb-4">
                                    By {mod.author}
                                </p>
                                <div className="flex space-x-2 mt-auto">
                                    <button
                                        onClick={() =>
                                            toggleModInstallation(mod.title)
                                        }
                                        className={`${mod.installed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded-md w-full`}
                                    >
                                        {mod.installed ? "Uninstall" : "Install"}
                                    </button>
                                    <button
                                        onClick={() => openModal(mod)}
                                        className="bg-gray-700 text-white px-2 py-1 rounded-md hover:bg-gray-600"
                                    >
                                        Info
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-xl text-gray-600">
                                No mods found matching "{searchTerm}"
                            </p>
                        </div>
                    )}
                </div>
            )}
            <ModInfoModal
                isOpen={isModalOpen}
                onClose={closeModal}
                mod={selectedMod}
            />
        </MainLayout>
    );
};

export default Home;
