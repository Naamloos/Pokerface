import { useState, useEffect } from "react";
import MainLayout from "../layouts/MainLayout";

interface Mod {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    installed: boolean;
}

const Home: React.FC = () => {
    const [mods, setMods] = useState<Mod[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, this would fetch from the Electron main process
        const fetchMods = async (): Promise<void> => {
            // Simulate loading
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock data
            const mockMods: Mod[] = [
                {
                    id: "1",
                    name: "Dummy Mods",
                    description: "This is a Dummy mod",
                    author: "John Doe",
                    version: "1.2.0",
                    installed: true,
                },
                {
                    id: "2",
                    name: "DummyMod2",
                    description:
                        "This is a Dummy mod 2, with a longer description to test the layout",
                    author: "Jane Doe",
                    version: "0.9.5",
                    installed: false,
                },
                {
                    id: "3",
                    name: "DummyMod 3 DX",
                    description: "This is a Dummy mod 3",
                    author: "John Doe",
                    version: "2.1.0",
                    installed: true,
                },
            ];

            setMods(mockMods);
            setIsLoading(false);
        };

        fetchMods();
    }, []);

    const filteredMods = mods.filter(
        (mod) =>
            mod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mod.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleModInstallation = (id: string): void => {
        setMods(
            mods.map((mod) =>
                mod.id === id ? { ...mod, installed: !mod.installed } : mod
            )
        );
    };

    return (
        <MainLayout>
            <header className="mb-8">
                <h1 className="text-5xl text-center mb-2 text-white">
                    Pokerface
                </h1>
                <p className="text-xl text-center text-gray-300">
                    Just a Balatro mod manager
                </p>
            </header>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search mods..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-base text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="mb-6 flex justify-between items-center text-lg">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Launch Balatro
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Refresh Mods
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-xl">Loading mods...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMods.length > 0 ? (
                        filteredMods.map((mod) => (
                            <div
                                key={mod.id}
                                className="border rounded-md p-4 bg-base shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-medium">
                                        {mod.name}
                                    </h3>
                                    <span className="text-sm bg-gray-800 px-2 py-1 rounded-full">
                                        {mod.version}
                                    </span>
                                </div>
                                <p className="text-gray-400 mb-3">
                                    {mod.description}
                                </p>
                                <p className="text-md text-gray-300 mb-4">
                                    By {mod.author}
                                </p>

                                <button
                                    onClick={() =>
                                        toggleModInstallation(mod.id)
                                    }
                                    className={`${mod.installed ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white px-4 py-1 rounded-md w-full`}
                                >
                                    {mod.installed ? "Uninstall" : "Install"}
                                </button>
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

            <footer className="mt-12 text-center text-gray-300 text-md bg-base w-fit m-auto px-2 rounded-md">
                <p>
                    &copy; Naamloos | Background: reactbits.dev | Font: m6x11 by Daniel Linssen.
                </p>
            </footer>
        </MainLayout>
    );
};

export default Home;
