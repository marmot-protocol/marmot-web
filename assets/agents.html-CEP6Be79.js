import{c as a,b as o,d as r,u as e,r as s,o as i}from"./app-DZvVNV9l.js";const d="mdk",l="0.15.0",c="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/README.md",h=`<div id="marmot-integrations" class="mm-source-title">Marmot Integrations</div>
<p>Connectors that let you chat with an agent runtime you already run (Hermes, OpenClaw, Claude Code, Codex, OpenCode,
Pi, or Goose) from White Noise, over end-to-end encrypted Marmot groups. Each connector runs next to the local <code>wn-agent</code>
service on your Mac or Linux machine. Start with <a href="#get-started-white-noise--agents">Get Started</a>; the later sections
explain topology, identities, and sharing for operators. To write your own client against <code>wn-agent</code> instead, such as a
notifier bot, see <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/custom-client.md">Build your own client</a>.</p>
<h2 id="contents">Contents</h2>
<ul>
<li><a href="#get-started-white-noise--agents">Get Started: White Noise + Agents</a></li>
<li><a href="#optional-latest-release-selection">Optional latest release selection</a></li>
<li><a href="#recommended-chat-setup">Recommended chat setup</a></li>
<li><a href="#connector-capabilities">Connector capabilities</a></li>
<li><a href="#first-install-verification">First-install verification</a></li>
<li><a href="#how-the-connectors-fit-together">How The Connectors Fit Together</a></li>
<li><a href="#default-install-topology">Default Install Topology</a></li>
<li><a href="#identity-model">Identity Model</a></li>
<li><a href="#what-is-shared">What Is Shared</a></li>
<li><a href="#what-is-separate">What Is Separate</a></li>
<li><a href="#allowlist-behavior">Allowlist Behavior</a></li>
<li><a href="#sharing-options">Sharing Options</a></li>
<li><a href="#development-paths">Development Paths</a></li>
</ul>
<h2 id="get-started-white-noise--agents">Get Started: White Noise + Agents</h2>
<p>You need:</p>
<ul>
<li>White Noise on your phone, with your account <code>npub</code> available;</li>
<li>one supported agent runtime already installed, authenticated, and working on
the same Mac or Linux machine where you will run the connector;</li>
<li>Linux x86_64, Linux arm64, macOS Apple Silicon, or macOS Intel.</li>
</ul>
<p>For Claude Code, paste the copied White Noise installation prompt into
<strong>Claude Code in a terminal on the computer where the connector will run</strong>.
The Claude mobile app uses a separate cloud session; installation belongs on
your Mac or Linux machine. Install and sign in to Claude Code first using its
<a href="https://code.claude.com/docs/en/setup">official setup guide</a>, then check
<code>claude --version</code> and an ordinary local conversation under the service user.</p>
<p>On your phone, check that White Noise's relay list contains
<code>wss://relay.eu.whitenoise.chat</code> and <code>wss://relay.us.whitenoise.chat</code> for the
default setup. Check the phone settings directly; the connector computer
cannot confirm them. For a custom set, configure the connector to match it.</p>
<p>Choose the runtime you already use:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Runtime</th>
<th scope="col" role="columnheader">Connector style</th>
<th scope="col" role="columnheader">Best fit</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Runtime" role="cell">Hermes</td>
<td data-label="Connector style" role="cell">Gateway plugin</td>
<td data-label="Best fit" role="cell">Rich chat history, reactions, media, and live previews</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">OpenClaw</td>
<td data-label="Connector style" role="cell">Channel plugin</td>
<td data-label="Best fit" role="cell">Gateway routing, history and media</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Claude Code</td>
<td data-label="Connector style" role="cell">Terminal harness</td>
<td data-label="Best fit" role="cell">Repository and coding tasks through Claude Code</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Codex</td>
<td data-label="Connector style" role="cell">Terminal harness</td>
<td data-label="Best fit" role="cell">Repository and coding tasks through Codex</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">OpenCode</td>
<td data-label="Connector style" role="cell">Terminal harness</td>
<td data-label="Best fit" role="cell">Repository and coding tasks through OpenCode</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Pi</td>
<td data-label="Connector style" role="cell">Terminal harness</td>
<td data-label="Best fit" role="cell">Repository and coding tasks through Pi</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Goose</td>
<td data-label="Connector style" role="cell">Terminal harness</td>
<td data-label="Best fit" role="cell">Repository and coding tasks through Goose</td>
</tr>
<tr role="row">
<td data-label="Runtime" role="cell">Your own client</td>
<td data-label="Connector style" role="cell"><code>wn-agent</code> only</td>
<td data-label="Best fit" role="cell">Notifier bots, scripts and custom runtimes (<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/custom-client.md">guide</a>)</td>
</tr>
</tbody>
</table>
<p>The guided installers prompt on the terminal for the White Noise account that
may invite and message the agent. They install the selected WN Agent release, create
an isolated White Noise identity for the selected connector, and start same-user
services where supported. Download each installer with its adjacent checksum,
verify it, and only then execute the local file:</p>
<h3 id="verified-installer-helper">Verified installer helper</h3>
<p>Define this helper once, then choose a runtime below. It downloads the installer
and its sibling checksum, verifies the bytes, and runs only the verified local
file. The release publisher is the trust anchor; the checksum is not an
independent endorsement. The helper runs the verified script with <code>bash</code>;
do not double-click the downloaded <code>.sh</code> file. For a manual download, verify
its matching checksum before running <code>bash install-claude-marmot.sh</code>.</p>
<p>For the documented release, use the pinned <code>base_url</code> below. Its installers and
companion assets stay in the same cohort. Remove stale <code>MARMOT_RELEASE_REPO</code>,
<code>MARMOT_RELEASE_TAG</code>, <code>WN_AGENT_VERSION</code> and <code>WN_AGENT_SHA</code> overrides for a default
install; explicit overrides describe a custom deployment.</p>
<pre><code class="language-sh">install_verified() (
  set -eu
  installer_url=&quot;$1&quot;
  checksum_url=&quot;$2&quot;
  shift 2
  case &quot;$installer_url&quot; in
    *[!a-zA-Z0-9:/._-]*) echo &quot;error: invalid installer URL&quot; &gt;&amp;2; exit 1 ;;
  esac
  if ! printf '%s\\n' &quot;$installer_url&quot; | LC_ALL=C grep -Eq '^https://github[.]com/marmot-protocol/mdk/releases/download/wn-agent-v[0-9]+[.][0-9]+[.][0-9]+/install-((hermes|openclaw|claude|codex|opencode|pi|goose)-marmot|wn-agent)[.]sh$'; then
    echo &quot;error: select a numeric WN Agent release before installing&quot; &gt;&amp;2
    exit 1
  fi
  if [ &quot;$checksum_url&quot; != &quot;$installer_url.sha256&quot; ]; then
    echo &quot;error: checksum must accompany the same release installer&quot; &gt;&amp;2
    exit 1
  fi
  installer_script=&quot;\${installer_url##*/}&quot;
  tmpdir=&quot;$(mktemp -d)&quot;
  trap 'rm -rf &quot;$tmpdir&quot;' 0 HUP INT TERM
  curl -fsSL --proto '=https' --proto-redir '=https' --connect-timeout 10 --max-time 180 &quot;$installer_url&quot; -o &quot;$tmpdir/$installer_script&quot;
  curl -fsSL --proto '=https' --proto-redir '=https' --connect-timeout 10 --max-time 180 &quot;$checksum_url&quot; -o &quot;$tmpdir/$installer_script.sha256&quot;
  if command -v shasum &gt;/dev/null 2&gt;&amp;1; then
    (cd &quot;$tmpdir&quot; &amp;&amp; shasum -a 256 -c &quot;$installer_script.sha256&quot;)
  elif command -v sha256sum &gt;/dev/null 2&gt;&amp;1; then
    (cd &quot;$tmpdir&quot; &amp;&amp; sha256sum -c &quot;$installer_script.sha256&quot;)
  else
    echo &quot;error: need shasum or sha256sum to verify the installer&quot; &gt;&amp;2
    exit 1
  fi
  bash &quot;$tmpdir/$installer_script&quot; &quot;$@&quot;
)
</code></pre>
<pre><code class="language-sh">base_url=&quot;https://github.com/marmot-protocol/mdk/releases/download/wn-agent-v0.15.0&quot;
</code></pre>
<h3 id="hermes">Hermes</h3>
<p>Hermes 0.19.0 or newer must already be installed and working.</p>
<p>If Hermes has multiple profiles or a custom home, read
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot/README.md#first-install-and-profile-selection">first install and profile selection</a>
<strong>before</strong> invoking the installer. Export the intended <code>HERMES_HOME</code>, and choose
separate connector homes/sockets/service names for independent agents. The
installer does not infer the intended profile from the installation prompt.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-hermes-marmot.sh&quot; \\
  &quot;$base_url/install-hermes-marmot.sh.sha256&quot;
</code></pre>
<h3 id="openclaw">OpenClaw</h3>
<p>OpenClaw 2026.10.10 or newer and Node 24.22.1+ (24.x) or 26.12.1+ must already be installed.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-openclaw-marmot.sh&quot; \\
  &quot;$base_url/install-openclaw-marmot.sh.sha256&quot;
</code></pre>
<h3 id="claude-code">Claude Code</h3>
<p>Claude Code 2.1.0 or newer must already be installed, authenticated, and
runnable as <code>claude</code> on the connector computer. See the
<a href="https://code.claude.com/docs/en/setup">official setup guide</a> if it is not ready.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-claude-marmot.sh&quot; \\
  &quot;$base_url/install-claude-marmot.sh.sha256&quot;
</code></pre>
<h3 id="codex">Codex</h3>
<p>Codex must already be installed, authenticated, and runnable as <code>codex</code>.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-codex-marmot.sh&quot; \\
  &quot;$base_url/install-codex-marmot.sh.sha256&quot;
</code></pre>
<h3 id="opencode">OpenCode</h3>
<p>OpenCode 1.18.18 or newer must already be installed and runnable as <code>opencode</code>.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-opencode-marmot.sh&quot; \\
  &quot;$base_url/install-opencode-marmot.sh.sha256&quot;
</code></pre>
<h3 id="pi">Pi</h3>
<p>Pi must already be installed, authenticated, and runnable as <code>pi</code>.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-pi-marmot.sh&quot; \\
  &quot;$base_url/install-pi-marmot.sh.sha256&quot;
</code></pre>
<h3 id="goose">Goose</h3>
<p>Goose 1.53.0 or newer must already be installed, configured with a provider,
and runnable as <code>goose</code>. The Goose harness supports the <code>inherit</code> and
<code>unrestricted</code> execution profiles only.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-goose-marmot.sh&quot; \\
  &quot;$base_url/install-goose-marmot.sh.sha256&quot;
</code></pre>
<h3 id="wn-agent-only-your-own-client">wn-agent only (your own client)</h3>
<p>For your own client against the control socket, such as a notifier bot, this
installer installs and starts <code>wn-agent</code> alone, without a harness or plugin.
<code>--bootstrap</code> creates the agent identity; <code>--import-identity</code> imports an
existing key instead. The connector's identity must not also be signed in on
another client. Continue with <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/custom-client.md">Build your own client</a>.</p>
<p><code>install-wn-agent.sh</code> is published from WN Agent 0.15.0 onward. If you pin
0.14.0 or earlier in <code>base_url</code>, run the installer from a clone of this
repository instead. It downloads and verifies that release's <code>wn-agent</code> bundle
the same way:</p>
<pre><code class="language-sh">bash scripts/install-wn-agent.sh --bootstrap
</code></pre>
<p>Otherwise, run this example in the same shell where <code>install_verified</code> above
was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-wn-agent.sh&quot; \\
  &quot;$base_url/install-wn-agent.sh.sha256&quot; --bootstrap
</code></pre>
<h3 id="finish-in-white-noise">Finish In White Noise</h3>
<p>Each installer records the new agent's <code>npub</code> and <code>nprofile</code> in the
<code>bootstrap.json</code> path printed at completion. Display them with:</p>
<pre><code class="language-sh">python3 -c 'import json,sys; d=json.load(open(sys.argv[1])); print(d[&quot;npub&quot;]); print(d[&quot;nprofile&quot;])' \\
  &quot;$HOME/.marmot-agents/codex/bootstrap.json&quot;
</code></pre>
<p>Use <code>hermes</code>, <code>openclaw</code>, <code>claude</code>, <code>codex</code>, <code>harnesses</code> (OpenCode), <code>pi</code>, or <code>goose</code> in that path.
The installers also show these values directly and render a terminal QR when
<code>qrencode</code> is installed.</p>
<ol>
<li>Compare the <strong>entire agent npub</strong> displayed on your trusted computer with the
account you add in White Noise. Check the account before accepting an
agent-created invitation or sending a task. A name, emoji, group title, or
public profile is not proof of identity.</li>
<li>Give the verified account a local nickname, where your app supports it. The
terminal installers do not publish a public agent profile. Suggested cues
are <code>🧑‍💻 Codex</code>, <code>🦀 Claude Code</code>, <code>🥧 Pi</code>, and <code>🛠️ OpenCode</code>; different
installations can have different private nicknames.</li>
<li>Invite it from the account you authorized. Terminal task groups can use a
normal group; ordinary messaging does not require an admin grant.</li>
<li>Send a harmless test prompt with a fresh word you choose, asking the agent
to echo that word without running tools or changing files. Check that the
backend's reply contains that word and arrives in the same verified group;
an older reply or a service-start acknowledgement does not prove this test
succeeded.</li>
</ol>
<p>For terminal harnesses (Claude Code, Codex, OpenCode, and Pi), first select a
workspace with <code>/&lt;path&gt;</code> beneath your home directory. For Codex, choose a Git
repository. A terminal harness <code>/status</code> response alone does not prove that its
backend can answer a phone prompt. Hermes and OpenClaw use their own gateway
workspace/session configuration instead of this terminal picker.</p>
<p>Connector files being installed is one milestone; a verified phone-to-backend
conversation is another. Terminal automatic titles require an instruction plus
matching group-profile-capable connector and harness releases. They are not enabled by
the installation steps alone. Once that capability is available, you can grant
the verified agent admin permission for title edits in a normal group. This
also allows group and member changes. Direct messages do not provide the same
editable group-title workflow. See the shared
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/terminal-harness/README.md#organize-your-task-groups">session workflow</a> and
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/terminal-harness/onboarding-design.md">onboarding design</a> for the proposed
defaults and their remaining dependencies.</p>
<p>Hermes and OpenClaw print one final gateway restart command because the installer
does not restart an existing gateway. Claude Code, Codex, OpenCode, Pi, and Goose services are
started by the default install. Their first group message can be <code>/&lt;path&gt;</code> to
select a working directory under your home directory.</p>
<h3 id="repeatable-agent-or-ci-setup">Repeatable Agent Or CI Setup</h3>
<p>For repeatable CI, save the exact numeric release URL printed during a
reviewed setup and set <code>base_url</code> to that saved URL instead of selecting a newer release
again on every run. Set <code>WN_AGENT_PINNED_BASE_URL</code> in the CI environment to that
reviewed exact URL; the example clears a previously resolved value if the pin
is missing, so the installer helper refuses it before any download.
Provide the authorized White Noise account explicitly. Terminal harnesses use the welcomer entry for both invitation and
prompt authorization. OpenClaw keeps those boundaries separate: <code>--allow-welcomer</code>
is invite admission only, and inbound sender authorization is a distinct
<code>senderPolicy</code> / <code>MARMOT_ALLOWED_USERS</code> configuration.</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">OWNER_NPUB=npub1...
base_url=&quot;\${WN_AGENT_PINNED_BASE_URL:-}&quot;
install_verified &quot;$base_url/install-codex-marmot.sh&quot; \\
  &quot;$base_url/install-codex-marmot.sh.sha256&quot; \\
  --yes --allow-welcomer &quot;$OWNER_NPUB&quot;
</code></pre>
<p>Replace <code>codex</code> in the URL with <code>claude</code>, <code>openclaw</code>, <code>opencode</code>, <code>pi</code>, or <code>goose</code>. Hermes keeps
invite acceptance and message-sender authorization explicit:</p>
<p>Run this example in the same shell where <code>install_verified</code> above was defined.</p>
<pre><code class="language-sh">install_verified &quot;$base_url/install-hermes-marmot.sh&quot; \\
  &quot;$base_url/install-hermes-marmot.sh.sha256&quot; \\
  --yes --allow-welcomer &quot;$OWNER_NPUB&quot; --allow-user &quot;$OWNER_NPUB&quot;
</code></pre>
<p>Every installer verifies the downloaded binary and plugin assets against the
checksums from the same immutable release. For independent
verification of the installer itself, download its adjacent <code>.sha256</code> asset
before running it.</p>
<p>Use each connector's README for existing-identity imports, shared deployments,
execution profiles, manual service control, and development workflows.</p>
<h2 id="optional-latest-release-selection">Optional latest release selection</h2>
<p>The default commands above use the release documented by this checkout. To
choose a newer release, first review its matching installation guide and
compatibility notes in the <a href="https://github.com/marmot-protocol/mdk/releases">release list</a>.
This optional lookup requires Python 3 with working TLS and GitHub API access;
it accepts published numeric WN Agent tags, including pre-releases, and excludes
drafts and suffixed tags. GitHub's repository-wide <code>/releases/latest</code> can select
a different product. The lookup stops after 1,000 entries and clears <code>base_url</code>
on failure. Fix API, network or certificate errors, or choose a numeric release
explicitly. Installer and checksum verification remain required.</p>
<p>Run this optional lookup in the same shell as the helper, then use the selected
runtime's <code>install_verified</code> command. Save the printed URL for repeatable installs.</p>
<pre><code class="language-sh">if base_url=&quot;$(python3 - &lt;&lt;'RELEASE'
import json, re, urllib.request
candidates = []
for page in range(1, 11):
    url = f&quot;https://api.github.com/repos/marmot-protocol/mdk/releases?per_page=100&amp;page={page}&quot;
    with urllib.request.urlopen(url, timeout=30) as response:
        releases = json.load(response)
    for release in releases:
        tag = release[&quot;tag_name&quot;]
        match = re.fullmatch(r&quot;wn-agent-v([0-9]+)\\.([0-9]+)\\.([0-9]+)&quot;, tag)
        if match and not release[&quot;draft&quot;] and release[&quot;published_at&quot;]:
            candidates.append((tuple(map(int, match.groups())), tag))
    if len(releases) &lt; 100:
        break
else:
    raise SystemExit(&quot;Release listing exceeded 1000 entries; choose a reviewed tag explicitly&quot;)
if not candidates:
    raise SystemExit(&quot;No published WN Agent release found&quot;)
tag = max(candidates)[1]
print(f&quot;https://github.com/marmot-protocol/mdk/releases/download/{tag}&quot;)
RELEASE
)&quot; &amp;&amp; test -n &quot;$base_url&quot;; then
  printf 'Selected WN Agent release: %s\\n' &quot;$base_url&quot;
else
  base_url=&quot;&quot;
  printf '%s\\n' 'error: release lookup failed; installation is unavailable until resolved' &gt;&amp;2
fi
</code></pre>
<h2 id="recommended-chat-setup">Recommended chat setup</h2>
<p>For a personal agent chat, the recommended setup is a dedicated group/DM with
<strong>the agent promoted to group admin</strong> so it can maintain a useful task title.
The phone owner performs the promotion through White Noise's group management.
Group admin carries real membership/profile authority; keep the human owner as
an admin too. This is recommended for trusted agents, not an automatic grant
in every shared group. Admin status does not authorize new senders or grant
backend tools. Ordinary messages and reactions do not require admin status.</p>
<p>Before installation, settle the few choices that change the setup:</p>
<ul>
<li>Which runtime/profile and existing account should this chat use? Default to
the selected runtime's isolated connector identity; reuse an identity only
when requested.</li>
<li>Which phone account may invite and prompt it, and which project directory
should terminal-harness work start in?</li>
<li>Is this a trusted personal agent chat with admin/title management? Recommend
yes; keep a shared group member-only unless its owner chooses otherwise.</li>
<li>Which files are needed, and is generated-file delivery supported/configured?
Keep the selected runtime's existing permissions as the execution default.</li>
</ul>
<p>Agent setup and chat policy is collected in
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/AGENTS.md#suggested-agent-chat-instructions">the integration instructions</a>.
These instructions are not installed automatically; tools still need deployment
configuration and the acceptance check below.</p>
<h3 id="check-the-tools-before-promising-the-experience">Check the tools before promising the experience</h3>
<ul>
<li><strong>Hermes:</strong> <code>marmot_group_profile</code> updates a name/description as an admin;
<code>marmot_reaction</code> adds/removes a message reaction. The optional presence
policy and model-issued reactions need one consistent owner so they do not
compete. See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot/README.md#what-you-can-do">the Hermes guide</a>.</li>
<li><strong>OpenClaw:</strong> <code>marmot_group_profile</code> updates the group name or description
when the account is an admin. The normal <code>message</code> tool supports <code>react</code> with
an emoji, target message id and chat target; <code>remove: true</code> removes it.</li>
<li><strong>Claude Code, Codex, OpenCode and Pi:</strong> each ordinary turn supplies the
shared <code>wn-agent group-profile</code> route for admin name/description updates.
The backend needs <code>wn-agent</code> on its PATH and shell/sandbox permission to reach
the selected connector's local socket. See the
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/terminal-harness/README.md#admin-group-profile-updates">admin profile guide</a>.
Harnesses do not provide a built-in reaction tool. A deployment that needs
progress reactions must separately configure and verify that capability.
Bind every operation to the actual conversation and connector account; never
guess a chat from its name, put control secrets in prompts, or start a second
writer against the same account home. Verify the installed release exposes
the documented command/tool before promising title updates.</li>
</ul>
<h3 id="acceptance-check-on-the-phone">Acceptance check on the phone</h3>
<ol>
<li>Invite the bootstrapped agent from the authorized phone account and grant
admin in the intended chat when title management is selected.</li>
<li>Select the project for a terminal harness, then send a small ordinary model
request. Verify the response lands in that same chat.</li>
<li>If title/reaction tools are configured, verify a meaningful task title and
a 👀 → ✅ transition on the request, without a duplicate emoji message. Make
a new request to verify session continuity; a status question should keep
the task title. Never mark an unavailable command/tool or rejected admin change as passed.</li>
<li>Test one required file type and generated-file return if supported. Check
<a href="#connector-capabilities">the capability guide</a> before choosing the test.</li>
<li>Report which runtime/profile, connector identity, services and chat were
verified, and list remaining phone/tool checks explicitly. A service start,
local <code>/status</code> reply or readiness probe alone is not this acceptance check.</li>
</ol>
<h2 id="connector-capabilities">Connector capabilities</h2>
<p>All seven connectors provide encrypted White Noise conversations with an agent
runtime you already use. The runtime supplies the model, tools and permissions;
<code>wn-agent</code> supplies Marmot identity, encrypted transport and durable delivery.
Choose by the features you need:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Connector</th>
<th scope="col" role="columnheader">Conversation and controls</th>
<th scope="col" role="columnheader">Files</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot/README.md#what-you-can-do">Hermes</a></td>
<td data-label="Conversation and controls" role="cell">DM/group activation; history, quotes, reactions, own-message deletion, admin group profile updates; optional live previews/presence/approval reactions</td>
<td data-label="Files" role="cell">Inbound media; image/document/video/voice sends with approved-root staging</td>
</tr>
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/openclaw/marmot/README.md#what-you-can-do">OpenClaw</a></td>
<td data-label="Conversation and controls" role="cell">Gateway routing; DM/group activation; history, quotes, quiet changes, own-message edits and deletion, reactions, admin group profile updates, consent-based public profile naming; current inbound turns are final-only</td>
<td data-label="Files" role="cell">Host-authorized inbound/outbound media via normal message tool</td>
</tr>
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/claude/marmot/README.md#what-you-can-do">Claude Code</a></td>
<td data-label="Conversation and controls" role="cell">Per-chat session/project/goal; shared chat and recovery commands; admin group profile updates; text replies</td>
<td data-label="Files" role="cell">Text-only; no attachments or generated-file return</td>
</tr>
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/codex/marmot/README.md#what-you-can-do">Codex</a></td>
<td data-label="Conversation and controls" role="cell">Per-chat thread/project/goal; shared chat and recovery commands; admin group profile updates; completed text replies</td>
<td data-label="Files" role="cell">Native images and supported staged files; opt-in generated-file return with exact grants</td>
</tr>
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/opencode/marmot/README.md#what-you-can-do">OpenCode</a></td>
<td data-label="Conversation and controls" role="cell">Per-chat session/project/goal; shared chat and recovery commands; admin group profile updates; text-event replies</td>
<td data-label="Files" role="cell">Supported images/PDFs/text; no generated-file return</td>
</tr>
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/pi/marmot/README.md#what-you-can-do">Pi</a></td>
<td data-label="Conversation and controls" role="cell">Per-chat session/project/goal; shared chat and recovery commands; admin group profile updates; completed text replies</td>
<td data-label="Files" role="cell">Supported images/text; no generated-file return</td>
</tr>
<tr role="row">
<td data-label="Connector" role="cell"><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/goose/marmot/README.md">Goose</a></td>
<td data-label="Conversation and controls" role="cell">Per-chat session/project/goal; shared chat and recovery commands; text replies between tool calls</td>
<td data-label="Files" role="cell">Text-only; no attachments or generated-file return</td>
</tr>
</tbody>
</table>
<p>For terminal harnesses, start with <code>/cd src/my-project</code>, send an ordinary request,
then use <code>/status</code>, <code>/goal &lt;instruction&gt;</code> or <code>/new</code> as needed. The complete
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/terminal-harness/README.md#chat-commands">chat-command reference</a> explains
recovery, session resets and slash escaping. These harnesses do not add gateway
mention activation, reaction tools or live previews.</p>
<p>For gateway plugins, ask in the current chat and use the runtime's registered
Marmot tools and media-delivery contract. A file accepted by a connector is not
a promise that the selected model can interpret it. Voice/audio upload shares
the group's configured media endpoint and limits; personal kind-10063 discovery
is not yet implemented. Each linked guide explains opt-ins, restrictions and
verification steps; installing another connector does not inherit its features.</p>
<h2 id="first-install-verification">First-install verification</h2>
<p>For a copied White Noise installation prompt, use the connector's
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/agent-connector/README.md#first-installation-from-a-white-noise-prompt">first-install checklist</a>
and the selected runtime's guide. Resolve the actual runtime/profile home,
choose one owner for each connector socket/service, verify the downloaded
installer checksum and release cohort, and configure both invitation and
message-sender authorization. A successful install/bootstrap is not proof of
an agent reply reaching the phone: finish with an invited, allowed-account
White Noise round trip.</p>
<p>Before installing, follow the runtime-specific checklist: <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot/README.md#first-install-and-profile-selection">Hermes</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/openclaw/marmot/README.md#first-install-checklist">OpenClaw</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/claude/marmot/README.md#first-install-checklist">Claude Code</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/codex/marmot/README.md#first-install-checklist">Codex</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/opencode/marmot/README.md#first-install-checklist">OpenCode</a>,
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/pi/marmot/README.md#first-install-checklist">Pi</a>, or
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/goose/marmot/README.md#install-goose-already-installed">Goose</a>. The five terminal harnesses also
share a <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/terminal-harness/README.md#first-installation-and-verification">two-process/environment verification guide</a>.
These guides distinguish invitation authorization from prompt authorization and
actual backend replies from local setup/status acknowledgements.</p>
<p>For Hermes files, stage a regular file under the adapter's approved source root
before returning <code>MEDIA:&lt;absolute-path&gt;</code>; see the
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot/README.md#sending-a-generated-file">copy-and-send example</a>.
The default source root is the connector home's <code>dev/inbound-media</code>, not an
arbitrary workspace. OpenClaw and terminal harnesses have their own documented
attachment/export contracts; do not apply Hermes's <code>MEDIA:</code> syntax to them.</p>
<h2 id="how-the-connectors-fit-together">How The Connectors Fit Together</h2>
<p>Current integrations:</p>
<ul>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/hermes/marmot"><code>hermes/marmot</code></a> - Hermes platform plugin.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/openclaw/marmot"><code>openclaw/marmot</code></a> - OpenClaw channel plugin.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/claude/marmot"><code>claude/marmot</code></a> - <code>wn-claude</code> Claude Code harness binary.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/codex/marmot"><code>codex/marmot</code></a> - <code>wn-codex</code> Codex harness binary.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/opencode/marmot"><code>opencode/marmot</code></a> - <code>wn-opencode</code> OpenCode harness binary.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/pi/marmot"><code>pi/marmot</code></a> - <code>wn-pi</code> Pi harness binary.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/goose/marmot"><code>goose/marmot</code></a> - <code>wn-goose</code> Goose harness binary.</li>
<li><a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/integrations/terminal-harness"><code>terminal-harness</code></a> - shared hardened runtime for the
Claude Code, Codex, OpenCode, Pi, and Goose terminal harnesses.</li>
</ul>
<p>All integrations are intentionally thin at the Marmot boundary. They do not own MLS
state, Nostr transport, local account storage, relay access, QUIC preview
transport, or durable encrypted sends. <code>wn-agent</code> owns those concerns and exposes
the local <code>marmot.agent-control.v2</code> newline-delimited JSON protocol over a Unix
socket.</p>
<h2 id="default-install-topology">Default Install Topology</h2>
<p>The release installers are published with the <code>wn-agent-v*</code> release family:</p>
<ul>
<li><code>scripts/install-hermes-marmot.sh</code> (passive <code>--doctor [--json]</code> report; not delivery proof)</li>
<li><code>scripts/install-openclaw-marmot.sh</code></li>
<li><code>scripts/install-claude-marmot.sh</code></li>
<li><code>scripts/install-codex-marmot.sh</code></li>
<li><code>scripts/install-opencode-marmot.sh</code></li>
<li><code>scripts/install-pi-marmot.sh</code></li>
<li><code>scripts/install-goose-marmot.sh</code></li>
<li><code>scripts/install-wn-agent.sh</code> (connector only, for your own client)</li>
</ul>
<p>By default the production-shaped installs create separate local agent identities
per connector:</p>
<table class="mm-responsive-table" role="table">
<thead role="rowgroup">
<tr role="row">
<th scope="col" role="columnheader">Integration</th>
<th scope="col" role="columnheader">Home</th>
<th scope="col" role="columnheader">Same-user service</th>
</tr>
</thead>
<tbody role="rowgroup">
<tr role="row">
<td data-label="Integration" role="cell">Hermes</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/hermes</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-hermes.service</code> / <code>org.marmot.wn-agent.hermes</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell">OpenClaw</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/openclaw</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-openclaw.service</code> / <code>org.marmot.wn-agent.openclaw</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell">Claude Code harness</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/claude</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-claude.service</code> / <code>org.marmot.wn-agent.claude</code> plus <code>wn-claude.service</code> / <code>org.marmot.wn-claude</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell">Codex harness</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/codex</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-codex.service</code> / <code>org.marmot.wn-agent.codex</code> plus <code>wn-codex.service</code> / <code>org.marmot.wn-codex</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell">OpenCode harness</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/harnesses</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-harnesses.service</code> / <code>org.marmot.wn-agent.harnesses</code> plus <code>wn-opencode.service</code> / <code>org.marmot.wn-opencode</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell">Pi harness</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/pi</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-pi.service</code> / <code>org.marmot.wn-agent.pi</code> plus <code>wn-pi.service</code> / <code>org.marmot.wn-pi</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell">Goose harness</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/goose</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-goose.service</code> / <code>org.marmot.wn-agent.goose</code> plus <code>wn-goose.service</code> / <code>org.marmot.wn-goose</code></td>
</tr>
<tr role="row">
<td data-label="Integration" role="cell"><code>wn-agent</code> only</td>
<td data-label="Home" role="cell"><code>$HOME/.marmot-agents/standalone</code></td>
<td data-label="Same-user service" role="cell"><code>wn-agent-standalone.service</code> / <code>org.marmot.wn-agent.standalone</code></td>
</tr>
</tbody>
</table>
<p>Each home derives its own default socket at <code>$MARMOT_HOME/dev/wn-agent.sock</code> and
uses the public relay defaults shared with the phone app pilot setup. Claude Code,
Codex, OpenCode, Pi, and Goose use separate connector homes and Marmot identities by default. They share
implementation in <code>integrations/terminal-harness</code>, but they do not share prompts,
sessions, sockets, or services unless an operator explicitly configures a shared
deployment.</p>
<p>Hermes and OpenClaw install or patch their host-runtime plugin configuration and
then print restart guidance for the existing gateway. They do not restart the
gateway automatically. <code>wn-claude</code>, <code>wn-codex</code>, <code>wn-opencode</code>, <code>wn-pi</code>, and <code>wn-goose</code> each install their own harness
binary and service in addition to <code>wn-agent</code>, because they are standalone
harnesses rather than plugins loaded by an existing gateway.</p>
<h2 id="identity-model">Identity Model</h2>
<p>The default topology creates or reuses one Marmot account per connector home,
which means Hermes, OpenClaw, Claude Code, Codex, OpenCode, Pi, and Goose present as separate Nostr
identities when installed with default options.</p>
<p>Within each home, <code>wn-agent bootstrap</code> lists local-signing accounts and reuses one
when selection is unambiguous. If no local account exists, bootstrap creates one.
If more than one local-signing account exists, production integrations should
require an explicit account id instead of guessing.</p>
<p>The installers persist the selected account into connector-specific config:</p>
<ul>
<li>Hermes uses <code>MARMOT_ACCOUNT_ID_HEX</code> or the Marmot plugin config.</li>
<li>OpenClaw uses <code>channels.marmot.accountIdHex</code> or <code>MARMOT_ACCOUNT_ID_HEX</code>.</li>
<li><code>wn-claude</code> uses <code>WN_CLAUDE_ACCOUNT_ID_HEX</code>.</li>
<li><code>wn-codex</code> uses <code>WN_CODEX_ACCOUNT_ID_HEX</code>.</li>
<li><code>wn-opencode</code> uses <code>WN_OPENCODE_ACCOUNT_ID_HEX</code>.</li>
<li><code>wn-pi</code> uses <code>WN_PI_ACCOUNT_ID_HEX</code>.</li>
<li><code>wn-goose</code> uses <code>WN_GOOSE_ACCOUNT_ID_HEX</code>.</li>
</ul>
<p>Installing all seven connectors on one machine with default options therefore
creates distinct agent identities and distinct chat/group memberships.</p>
<h2 id="what-is-shared">What Is Shared</h2>
<p>Within one connector home, the host integration and its <code>wn-agent</code> share:</p>
<ul>
<li>the local Marmot account and Nostr public key;</li>
<li>the local MLS/group state and app runtime projection;</li>
<li>relay configuration and key-package/profile publication through <code>wn-agent</code>;</li>
<li>the account-scoped welcomer allowlist used for invite acceptance;</li>
<li>the local control socket and optional bearer-token gate;</li>
<li>durable sends, deletes, media download staging, and idempotency handled by
<code>wn-agent</code>;</li>
<li>the inbound event stream exposed by <code>SubscribeInbound</code>.</li>
</ul>
<p>Across different default connector homes, those items are not shared.</p>
<p>Advanced deployments can still point multiple integrations at the same
<code>MARMOT_HOME</code> and socket. The control socket supports multiple clients, and
multiple integrations can subscribe to inbound events for the same account at the
same time.</p>
<h2 id="what-is-separate">What Is Separate</h2>
<p>Each host runtime keeps its own runtime state:</p>
<ul>
<li>Hermes keeps Hermes gateway/plugin state under <code>HERMES_HOME</code>.</li>
<li>OpenClaw keeps OpenClaw gateway/channel state under <code>OPENCLAW_HOME</code>.</li>
<li><code>wn-claude</code> keeps harness configuration in <code>$MARMOT_HOME/dev/wn-claude.env</code>
and session state under <code>$XDG_STATE_HOME/wn-claude</code> by default.</li>
<li><code>wn-codex</code> keeps harness configuration in <code>$MARMOT_HOME/dev/wn-codex.env</code>
and session state under <code>$XDG_STATE_HOME/wn-codex</code> by default.</li>
<li><code>wn-opencode</code> keeps harness configuration in
<code>$MARMOT_HOME/dev/wn-opencode.env</code> and session state under
<code>$XDG_STATE_HOME/wn-opencode</code> by default.</li>
<li><code>wn-pi</code> keeps harness configuration in <code>$MARMOT_HOME/dev/wn-pi.env</code>, connector
state under <code>$XDG_STATE_HOME/wn-pi</code>, and Pi sessions under
<code>$MARMOT_HOME/dev/pi-sessions</code> by default.</li>
<li><code>wn-goose</code> keeps harness configuration in <code>$MARMOT_HOME/dev/wn-goose.env</code>
and connector state under <code>$XDG_STATE_HOME/wn-goose</code> by default. Goose
sessions live in the operator's Goose session store, or under
<code>WN_GOOSE_PATH_ROOT</code> when that is set.</li>
</ul>
<p>Each integration also makes its own activation decision:</p>
<ul>
<li>Hermes and OpenClaw are gateway/channel integrations. Each applies its own
inbound sender ACL before activation. In multi-party groups they default to
mention-style activation and always reply in effective DMs. Activation cannot
widen sender authorization. They also support richer gateway features such as
live previews, durable reply routing, profile onboarding, and media handling.</li>
<li><code>wn-claude</code>, <code>wn-codex</code>, <code>wn-opencode</code>, <code>wn-pi</code>, and <code>wn-goose</code> are pure harnesses. They currently support only
<code>always</code> activation for prompt messages from explicitly allowed senders, and
have no profile onboarding or live-preview behavior. Their shared runtime
validates and privately stages bounded ordered attachment batches. <code>wn-codex</code>
maps image batches to ordered Codex image inputs; <code>wn-opencode</code> passes each
file as an ordered <code>opencode run --file</code> argument; <code>wn-pi</code> passes each image
or UTF-8 text file as an ordered <code>@file</code> operand and rejects the whole batch
before spawning Pi if any file is another type; <code>wn-claude</code> and <code>wn-goose</code>
reject every non-empty batch, including its accompanying text, before
spawning their backend.</li>
</ul>
<p>Because activation is per integration, there is no global &quot;claim this message&quot;
lease in shared-account deployments. If several integrations subscribe to the
same account and group, every eligible integration can reply. For example, a
direct message from an allowlisted sender could trigger Hermes/OpenClaw,
<code>wn-claude</code>, <code>wn-codex</code>, <code>wn-opencode</code>, <code>wn-pi</code>, and <code>wn-goose</code> if all are running and configured for that account.</p>
<h2 id="allowlist-behavior">Allowlist Behavior</h2>
<p>The <code>wn-agent</code> welcomer allowlist is account-scoped, not integration-scoped. In
the default installer topology that means each connector has its own allowlist.
It matters most when several integrations are intentionally configured to manage
the same account.</p>
<p>Invite admission defaults to <code>allowlist</code>. Public direct-message bots can opt in
without enabling debug controls by rerunning bootstrap with
<code>--invite-policy any-authenticated-direct</code>; this accepts an authenticated
welcomer only when the resulting MLS group has exactly two members. The other
explicit policies are <code>deny</code>, <code>allowlist</code>, and <code>any-authenticated</code> (which also
admits multi-party groups). These account-scoped invite policies remain
independent from each integration's sender and activation policy.</p>
<p>Hermes and OpenClaw can mirror configured <code>allowFrom</code>/welcomer entries into
<code>wn-agent</code>. That mirroring is invite admission only. Hermes and OpenClaw each
keep a separate inbound sender ACL (<code>MARMOT_ALLOWED_USERS</code> /
<code>MARMOT_ALLOW_ALL_USERS</code>, plus OpenClaw <code>channels.marmot.senderPolicy</code>) and do
not treat membership or welcomer status as authorization to invoke the agent.
Their welcomer sync path is config-driven and may reconcile the connector
allowlist to the configured set. All terminal harnesses require at least one
allowed sender and install those senders into both the prompt allowlist and the
<code>wn-agent</code> welcomer allowlist. Their startup mirroring is additive: removing a
sender only from <code>wn-agent</code> is not a full harness revoke while the sender remains
in <code>WN_CLAUDE_ALLOWED_SENDERS_HEX</code>, <code>WN_CODEX_ALLOWED_SENDERS_HEX</code>,
<code>WN_OPENCODE_ALLOWED_SENDERS_HEX</code>, or
<code>WN_PI_ALLOWED_SENDERS_HEX</code>.</p>
<p>For shared-account deployments, prefer one explicit source of truth for the
account's allowed welcomers, or configure every integration with the same
intended union.</p>
<h2 id="sharing-options">Sharing Options</h2>
<p>Run the default installers when you want each connector to appear as its own
agent identity.</p>
<p>Use an explicit shared deployment when you want one Marmot identity behind
several integrations:</p>
<ul>
<li>one shared <code>MARMOT_HOME</code>;</li>
<li>one shared <code>MARMOT_AGENT_SOCKET</code>;</li>
<li>one <code>wn-agent</code> service owning that socket;</li>
<li>explicit account ids in each integration config;</li>
<li><code>--no-service</code> for secondary installers, or manual service units with a single
owner for the shared socket;</li>
<li>separate host-runtime homes such as <code>HERMES_HOME</code> and <code>OPENCLAW_HOME</code> if the
gateway runtimes themselves should stay isolated.</li>
</ul>
<p>The current Hermes, OpenClaw, and terminal-harness release installers are
optimized for isolated defaults. They also expose <code>MARMOT_HOME</code>,
<code>MARMOT_AGENT_SOCKET</code>, <code>MARMOT_AGENT_LABEL</code>, <code>MARMOT_AGENT_SERVICE_NAME</code>, and
<code>MARMOT_AGENT_LAUNCHD_LABEL</code> overrides for advanced layouts.</p>
<p>If <code>wn-agent</code> and a host gateway run as different local users, keep the socket
Unix-domain only and use the existing socket mode plus bearer-token options:
<code>--auth-token-file</code>, group-readable socket modes, and
<code>MARMOT_AGENT_AUTH_TOKEN_FILE</code>.</p>
<p>That bearer is a full-daemon credential, not an account selector or a read-only
integration key. A holder can read all inbound plaintext and perform every
control operation for every account in that connector home. Share a connector
only among integrations in the same trust boundary. For a less-trusted plugin,
gateway, or tenant, use another <code>wn-agent</code> home, socket, token, and account.</p>
<h2 id="development-paths">Development Paths</h2>
<p>Each integration has its own README and AGENTS file for local details. Common
entry points from the repo root:</p>
<pre><code class="language-sh">just hermes-dev-script-test
just hermes-dev-e2e-deterministic
just hermes-dev-e2e-connector

just openclaw-dev-test
just openclaw-dev-script-test
just openclaw-dev-e2e-connector

cargo test -p wn-claude
just claude-dev-e2e-connector
just claude-installer-test

cargo test -p wn-codex
just codex-dev-e2e-connector
just codex-installer-test

cargo test -p wn-opencode
just opencode-dev-e2e-connector
just opencode-installer-test

cargo test -p marmot-terminal-harness

cargo test -p wn-pi
just pi-dev-e2e-connector
just pi-installer-test

cargo test -p wn-goose
just goose-dev-e2e-connector
just goose-installer-test

just wn-agent-installer-test
</code></pre>
<p>For release-installer work, test dry-runs and real release assets from the
<code>wn-agent-v*</code> release family. Do not assume a source checkout script exactly
matches the published installer.</p>
`,g={__name:"agents.html",setup(p){return(m,t)=>{const n=s("DocumentationPage");return i(),a("div",null,[t[0]||(t[0]=o("h1",{id:"bots-and-agents",tabindex:"-1"},[o("a",{class:"header-anchor",href:"#bots-and-agents"},[o("span",null,"Bots and agents")])],-1)),r(n,{document:{repo:e(d),version:e(l),sourceUrl:e(c),html:e(h)}},null,8,["document"])])}}},b=JSON.parse('{"path":"/docs/agents.html","title":"Bots and agents","lang":"en-US","frontmatter":{"title":"Bots and agents","description":"Bots and agents — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/agents.md"}');export{g as comp,b as data};
