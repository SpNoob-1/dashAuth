import { Sidebar } from "./_components/sidebar"

const configayoult = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-row">
            <Sidebar />
            <div className="flex items-center justify-center h-full w-full mt-15">
                {children}
            </div>
        </div>
    )
}

export default configayoult