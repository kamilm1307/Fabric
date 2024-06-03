import * as React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { FabricText } from './FabricText'
import { FabricYoutube } from './FabricYoutube'
import { fetchFabricQuery, defaultFabricQueryProps } from './fetchFabricQuery'
import type { FabricQueryProps } from './fetchFabricQuery'
import type { ExecuteOutput } from '../../lib/execute'
import { Spinner } from '../ui/spinner'

const MODES = [
  {
    key: 'text',
    title: 'Document / Query Input',
    desc: '',
    component: FabricText,
  },
  {
    key: 'youtube',
    title: 'Youtube Transcript',
    desc: '',
    component: FabricYoutube,
  },
]

type ModeSelectTabsProps = {
  onResult: (query: FabricQueryProps, response: ExecuteOutput) => void
}

export function ModeSelectTabs({ onResult }: ModeSelectTabsProps) {
  const [query, setQuery] = React.useState<FabricQueryProps>(defaultFabricQueryProps)
  const updateQuery = (newQuery: FabricQueryProps) => {
    console.log({ updateQuery: new Date(), newQuery })
    setQuery(newQuery)
  }
  const [spinner, setSpinner] = React.useState<boolean>(false)

  const runFabricQuery = async () => {
    console.log({ runFabricQuery: new Date(), query })
    setSpinner(true)
    const response = await fetchFabricQuery(query)
    console.log({ response })
    onResult(query, response)
    setSpinner(false)
  }

  return (
    <Tabs defaultValue={MODES[0].key}>
      <TabsList className="grid w-full grid-cols-2">
        {MODES.map(({ key, title }) => (
          <TabsTrigger value={key} key={key} className="capitalize">
            {title}
          </TabsTrigger>
        ))}
      </TabsList>
      {MODES.map(({ component, key, title, desc }) => (
        <TabsContent value={key} key={`tabcontent-${key}`}>
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">{React.createElement(component, { onUpdate: updateQuery })}</CardContent>
            <CardFooter>
              <Button onClick={runFabricQuery}>Run Fabric</Button>
              <Spinner size="medium" show={spinner} />
              {spinner && `Running ${query.pattern}...`}
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  )
}
