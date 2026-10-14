import { Sidebar } from "./_components/sidebar"

const configayoult = ({ children }: { children: React.ReactNode }) => {
    return (
        <div >
            <Sidebar />
            <div className="flex justify-center items-center h-full">
                {children}
            </div>
        </div>
    )
}

export default configayoult