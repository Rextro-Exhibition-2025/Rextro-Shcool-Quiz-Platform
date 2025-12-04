import React from "react";

interface SchoolData {
    rank: number;
    schoolName: string;
}

const SelectedSchools: React.FC = () => {
    const selectedSchoolList: SchoolData[] = [
        { rank: 1, schoolName: "KM / KM / Vipulananda Central College" },
        { rank: 2, schoolName: "Rahula College, Matara" },
        { rank: 3, schoolName: "Nalanda College, Colombo 10" },
        { rank: 4, schoolName: "Mahinda College, Galle" },
        { rank: 5, schoolName: "Harischandra National College, Negombo" },
        { rank: 6, schoolName: "Ananda College, Colombo 10" },
        { rank: 7, schoolName: "Jaffna Hindu College" },
        { rank: 8, schoolName: "Dharmaraja College, Ambalangoda" },
        { rank: 9, schoolName: "St. John’s College, Jaffna" },
        { rank: 10, schoolName: "St. Servatius’ College, Matara" },
        { rank: 11, schoolName: "St. Thomas Girls’ High School, Matara" },
        { rank: 12, schoolName: "Visakha Vidyalaya, Colombo 05" },
        { rank: 13, schoolName: "Defence Services College, Colombo 02" },
        { rank: 14, schoolName: "St. Michael’s College National School, Batticaloa" },
        { rank: 15, schoolName: "Royal College, Colombo 07" },
        { rank: 16, schoolName: "Panadura Balika Maha Vidyalaya" }
    ];

    const getRankBadgeStyle = (rank: number): string => {
        if (rank <= 3) {
            return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg transform scale-110';
        }
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br p-4 relative"
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {/* White background container for image */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: '#FED9DF',
                    zIndex: 0,
                }}
            />
            {/* Background image nested inside white background */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1,
                    pointerEvents: 'none',
                    backgroundImage: 'url("/Container.png")',
                    backgroundSize: 'auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'top',
                    backgroundAttachment: 'scroll',
                }}
            />
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255,255,255,0.6)',
                zIndex: 1
            }} />
            <div className="max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
                {/* Header */}
                <div className=" mb-8">
                    <h1 className="text-4xl font-bold mb-2 text-center" style={{ color: '#651321' }}>
                        Selected Teams for the Final Phase
                    </h1>
                </div>



                {/* Top 3 Podium */}
                <div className="flex justify-center items-end mb-12 space-x-6">
                    {/* Second Place */}
                    <div className="text-center bg-white p-8 shadow-lg flex flex-col items-center justify-center w-44 md:w-56" style={{ borderRadius: '50px' }}>
                        <div className="relative flex items-center justify-center">
                            <img
                                src="/Rank_2.png"
                                alt="Second Place"
                                className="w-20 md:w-24 h-auto block mx-auto"
                            />
                        </div>
                        <h3
                            title={selectedSchoolList[1].schoolName}
                            className="font-semibold text-sm md:text-base text-center text-gray-800 mb-2 max-w-[10rem] md:max-w-[16rem] whitespace-normal break-words leading-tight"
                        >
                            {selectedSchoolList[1].schoolName}
                        </h3>
                    </div>

                    {/* First Place */}
                    <div className="text-center mb-10 p-10 bg-white shadow-xl flex flex-col items-center justify-center w-56 md:w-72" style={{ borderRadius: '50px' }}>
                        <div className="relative flex items-center justify-center">
                            <img
                                src="/Rank_1.png"
                                alt="First Place"
                                className="w-24 md:w-32 h-auto block mx-auto"
                            />
                        </div>
                        <h3
                            title={selectedSchoolList[0]?.schoolName}
                            className="font-semibold text-base md:text-lg text-center text-gray-800 mb-2 max-w-[12rem] md:max-w-[20rem] whitespace-normal break-words leading-tight"
                        >
                            {selectedSchoolList[0]?.schoolName}
                        </h3>
                    </div>

                    {/* Third Place */}
                    <div className="text-center bg-white p-8 shadow-lg flex flex-col items-center justify-center w-44 md:w-56" style={{ borderRadius: '50px' }}>
                        <div className="relative flex items-center justify-center">
                            <img
                                src="/Rank_3.png"
                                alt="First Place"
                                className="w-20 md:w-24 h-auto block mx-auto"
                            />
                        </div>
                        <h3
                            title={selectedSchoolList[2]?.schoolName}
                            className="font-semibold text-sm md:text-base text-center text-gray-800 mb-2 max-w-[10rem] md:max-w-[16rem] whitespace-normal break-words leading-tight"
                        >
                            {selectedSchoolList[2]?.schoolName}
                        </h3>
                    </div>
                </div>

                {/* Full Rankings Table */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b flex justify-center items-center" style={{ backgroundColor: '#651321' }}>
                        <h2 className="text-xl font-bold text-white">Ranks</h2>
                    </div>

                    {/* Add a max height and make it scrollable */}
                    <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                        {selectedSchoolList.map((school, index) => (
                            <div
                                key={school.rank}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200 group cursor-pointer"
                            >
                                <div className="flex items-center space-x-4">
                                    {/* Rank Badge */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm${school.rank <= 3 ? '' : ' ' + getRankBadgeStyle(school.rank)}`}>
                                        {school.rank === 1 ? (
                                            <img src="/Rank_1.png" alt="1st Place" className="w-8 h-8 object-contain" />
                                        ) : school.rank === 2 ? (
                                            <img src="/Rank_2.png" alt="2nd Place" className="w-8 h-8 object-contain" />
                                        ) : school.rank === 3 ? (
                                            <img src="/Rank_3.png" alt="3rd Place" className="w-8 h-8 object-contain" />
                                        ) : (
                                            school.rank
                                        )}
                                    </div>

                                    {/* School Name */}
                                    <div>
                                        <h3 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                                            {school.schoolName}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedSchools;