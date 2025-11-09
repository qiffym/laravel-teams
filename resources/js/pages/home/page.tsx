import AppLayout from "@/layouts/app-layout"

import { Head } from "@inertiajs/react"
import { CardHeader } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import {Auth} from "@/types/auth";
import {usePermissions} from "@/hooks/use-permissions";

export default function Home({auth}: {auth: Auth}) {
  const can = usePermissions(auth?.user?.permissions!)
  return (
    <>
      <Head title="Inertia Laravel Starter kit" />
      {can('update_team') ? 'Yes' : 'No'} <br />
      {can('delete_team') ? 'Yes' : 'No'} <br />
      {can('leave_team') ? 'Yes' : 'No'} <br />
      <Container className="py-12">
        <CardHeader
          title="Laravel Starter Kit"
          description="A fully-featured Laravel starter kit built with Intent UI, offering a clean foundation for modern web apps."
        />
      </Container>
    </>
  )
}

Home.layout = (page: any) => <AppLayout children={page} />
