import { Outlet } from 'react-router-dom'
export function ContentLayout() {
  return (
    <div className="min-w-0">
      <Outlet />
    </div>
  )
}
