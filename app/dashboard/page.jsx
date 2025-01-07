import { Button } from "@/components/ui/button";
import SideNav from "./_components/SideNav";
import CreateForm from "./_components/CreateForm";
import FormList from "./_components/FormList";

function DashBoard() {
    return (
        <div className="p-10 flex flex-col bg-black gap-y-6">
            {/* Header and CreateForm container */}
            <div className="flex items-center justify-between">
                <h2 className="font-bold text-4xl gradient-title">Dashboard</h2>
                <CreateForm />
            </div>

            {/* Form List */}
            <FormList />
        </div>
    );
}

export default DashBoard;
