import { Beef, Dumbbell, Apple, Fish, Egg, Coffee } from 'lucide-react';

const GuideScreen = () => {
    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header */}
            <div className="bg-black px-6 pt-8 pb-6">
                <h1 className="text-2xl font-bold text-white mb-1">Fitness Guide</h1>
                <p className="text-gray-400 text-sm">Nutrition & Workout Tips</p>
            </div>

            <div className="px-6 space-y-8 pt-6">
                {/* High-Protein Ethiopian Foods */}
                <section>
                    <h2 className="text-base font-bold text-black mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <Beef className="w-5 h-5" />
                        High-Protein Local Foods
                    </h2>

                    <div className="bg-white border border-gray-200 overflow-hidden">
                        <NutritionCard icon={<Egg className="w-4 h-4" />}    name="Eggs (Inkuulaal)"       protein="6g per egg"      serving="3–4 eggs daily" />
                        <Divider />
                        <NutritionCard icon={<Fish className="w-4 h-4" />}   name="Tilapia Fish"           protein="26g per 100g"    serving="150–200g per meal" />
                        <Divider />
                        <NutritionCard icon={<Coffee className="w-4 h-4" />} name="Cottage Cheese (Ayib)"  protein="11g per 100g"    serving="100–150g daily" />
                        <Divider />
                        <NutritionCard icon={<Apple className="w-4 h-4" />}  name="Lentils (Misir)"        protein="9g per 100g"     serving="150–200g cooked" />
                        <Divider />
                        <NutritionCard icon={<Beef className="w-4 h-4" />}   name="Peanut Butter (Okote)"  protein="25g per 100g"    serving="2–3 tablespoons" />
                    </div>

                    <div className="mt-3 border border-gray-200 p-4">
                        <p className="text-xs text-gray-600">
                            <span className="font-semibold text-black">Pro Tip:</span> Aim for 1.6–2.2g of protein per kg of body weight daily for muscle building.
                        </p>
                    </div>
                </section>

                {/* Workout Split */}
                <section>
                    <h2 className="text-base font-bold text-black mb-4 flex items-center gap-2 uppercase tracking-wide">
                        <Dumbbell className="w-5 h-5" />
                        5-Day Workout Split
                    </h2>

                    <div className="space-y-2">
                        <WorkoutCard day="Day 1" focus="Upper Body"                       exercises={['Bench Press', 'Rows', 'Shoulder Press', 'Bicep Curls']} />
                        <WorkoutCard day="Day 2" focus="Lower Body"                       exercises={['Squats', 'Deadlifts', 'Leg Press', 'Calf Raises']} />
                        <WorkoutCard day="Day 3" focus="Rest / Cardio"                    exercises={['Light walking', 'Stretching', 'Active recovery']} muted />
                        <WorkoutCard day="Day 4" focus="Push (Chest, Shoulders, Triceps)" exercises={['Incline Press', 'Lateral Raises', 'Tricep Dips', 'Push-ups']} />
                        <WorkoutCard day="Day 5" focus="Pull & Legs"                      exercises={['Pull-ups', 'Deadlifts', 'Lunges', 'Hamstring Curls']} />
                    </div>

                    <div className="mt-3 border border-gray-200 p-4">
                        <p className="text-xs text-gray-600">
                            <span className="font-semibold text-black">Remember:</span> Progressive overload is key. Increase weight or reps each week.
                        </p>
                    </div>
                </section>

                {/* Hydration */}
                <section className="border border-gray-200 p-5">
                    <h3 className="font-bold text-black mb-2 text-sm uppercase tracking-wide">Hydration Goal</h3>
                    <p className="text-gray-500 text-xs mb-4">
                        Drink at least 3–4 litres of water daily, especially during workouts.
                    </p>
                    <div className="flex gap-1.5">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="flex-1 h-6 bg-gray-100 border border-gray-200" />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">8 glasses = ~2L minimum</p>
                </section>
            </div>
        </div>
    );
};

const NutritionCard = ({ icon, name, protein, serving }: { icon: React.ReactNode; name: string; protein: string; serving: string }) => (
    <div className="p-4 flex items-center gap-4">
        <div className="text-black">{icon}</div>
        <div className="flex-1">
            <h3 className="text-sm font-semibold text-black">{name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{serving}</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-black">{protein}</p>
        </div>
    </div>
);

const WorkoutCard = ({ day, focus, exercises, muted }: { day: string; focus: string; exercises: string[]; muted?: boolean }) => (
    <div className={`border p-4 ${muted ? 'border-gray-200 bg-gray-50' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-bold ${muted ? 'text-gray-400' : 'text-black'}`}>{day}</h3>
            <span className="text-xs font-medium text-gray-500">{focus}</span>
        </div>
        <ul className="space-y-1">
            {exercises.map((exercise, i) => (
                <li key={i} className={`text-xs flex items-center gap-2 ${muted ? 'text-gray-400' : 'text-gray-600'}`}>
                    <span className="w-1 h-1 bg-black rounded-full flex-shrink-0" />
                    {exercise}
                </li>
            ))}
        </ul>
    </div>
);

const Divider = () => <div className="border-t border-gray-100" />;

export default GuideScreen;
