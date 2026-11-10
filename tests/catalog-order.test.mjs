import test from 'node:test'
import assert from 'node:assert/strict'
import { isTeamProject, compareProjects } from '../docs/.vuepress/data/catalog-order.mjs'

test('team badges use the exact GitHub organization, including projects within MDK', () => {
  assert.equal(isTeamProject('https://github.com/marmot-protocol/mdk/tree/master/crates/cli'), true)
  assert.equal(isTeamProject('https://github.com/another-team/marmot-protocol'), false)
  assert.equal(isTeamProject('https://github.com/marmot-protocol-community/app'), false)
  assert.equal(isTeamProject('https://example.com/marmot-protocol/app'), false)
})

test('maintained team projects lead, but archived team projects follow active community projects', () => {
  const project = (name, team, activity) => ({name,href:`https://github.com/${team ? 'marmot-protocol' : 'community'}/${name}`,labels:['v2',activity]})
  const items = [project('Community',false,'active'),project('Legacy',true,'archived'),project('White Noise',true,'active'),project('MDK',true,'active')]
  assert.deepEqual(items.sort(compareProjects).map(item=>item.name), ['MDK','White Noise','Community','Legacy'])
})

test('primary platform apps precede terminal and web examples regardless of alphabetical order', () => {
  const app = (name, path) => ({name, href: `https://github.com/marmot-protocol/${path}`, category: 'Apps', labels: ['v2', 'active']})
  const items = [app('Web', 'marmots-web-chat'), app('CLI', 'mdk/tree/master/crates/cli'),
    app('Linux', 'whitenoise-linux'), app('macOS', 'whitenoise-mac'), app('Android', 'whitenoise-android'), app('iOS', 'whitenoise-ios')]
  assert.deepEqual(items.sort(compareProjects).map(item => item.name), ['iOS', 'Android', 'macOS', 'Linux', 'CLI', 'Web'])
})

test('a primary project loses its leading position when it becomes inactive or archived', () => {
  const items = [
    {name: 'MDK', href: 'https://github.com/marmot-protocol/mdk', labels: ['v2', 'archived']},
    {name: 'TypeScript', href: 'https://github.com/marmot-protocol/marmot-ts', labels: ['v2', 'inactive']},
    {name: 'Community SDK', href: 'https://github.com/community/sdk', labels: ['v2', 'active']},
  ]
  assert.deepEqual(items.sort(compareProjects).map(item => item.name), ['Community SDK', 'TypeScript', 'MDK'])
})

test('core SDKs and protocol tools precede team integrations without promoting nested MDK projects', () => {
  const project = (name, path, category = 'SDKs and libraries') => ({
    name, href: `https://github.com/marmot-protocol/${path}`, category, labels: ['v2', 'active'],
  })
  const items = [
    project('Marmot for Hermes', 'mdk/tree/master/integrations/hermes/marmot', 'Agents and automation'),
    project('Goggles', 'goggles', 'Tools and services'),
    project('Transponder', 'transponder', 'Tools and services'),
    project('Marmot specification', 'marmot', 'Tools and services'),
    project('marmot-ts', 'marmot-ts'),
    project('MDK', 'mdk/'),
  ]
  assert.deepEqual(items.sort(compareProjects).map(item => item.name), [
    'MDK', 'marmot-ts', 'Marmot specification', 'Transponder', 'Goggles', 'Marmot for Hermes',
  ])
})
