import{c as i,b as t,d as n,u as e,r,o as s}from"./app-C1yp260q.js";const c="mdk",d="0.15.0",l="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/DISTRIBUTION.md",m=`<div id="marmotkit-binary-distribution" class="mm-source-title">MarmotKit Binary Distribution</div>
<p>MarmotKit releases publish generated Swift/Kotlin APIs with matching native libraries as immutable GitHub Release
assets. Apple consumers use a binary-target XCFramework ZIP, generated Swift, and a separate SDK privacy manifest.
Android consumers unpack the Kotlin and JNI bundle into their app build.</p>
<p>Experimental device-group host test builds are separate from these published release/snapshot assets. Use the
<a href="__MARMOT_BASE__docs/native-apps.html#experimental-device-group-test-builds">explicit build flag and experimental constructor</a>, retain matching
native and generated inputs, and take artifacts only from <code>output-dev-device-groups/</code>. Ordinary release
automation and constructors do not opt in; never add policy-test timing overrides to a host artifact.</p>
<h2 id="apple-privacy-migration">Apple privacy migration</h2>
<p><strong>Migration required for releases built with this change.</strong> Apple XCFrameworks now contain raw static-library slices,
not resource-bearing frameworks. Updating only the binary URL loses SDK privacy delivery. Keep the remote SwiftPM
binary target, but update all three matching release inputs and the wrapper's resource declaration together:</p>
<ul>
<li><code>MarmotKitFFI-&lt;identifier&gt;.xcframework.zip</code> for iOS, or <code>MarmotKitFFI-macos-&lt;identifier&gt;.xcframework.zip</code> for macOS.</li>
<li><code>MarmotKit-&lt;identifier&gt;.swift</code>, shared by both platforms.</li>
<li><code>PrivacyInfo-ios-&lt;identifier&gt;.xcprivacy</code> or <code>PrivacyInfo-macos-&lt;identifier&gt;.xcprivacy</code>, for that platform's build.</li>
</ul>
<p>Download from the same exact release/snapshot tag. Verify the privacy asset with its sibling <code>.sha256</code> using
<code>shasum -a 256 -c &lt;filename&gt;.sha256</code>, and verify Swift/binary hashes against the platform manifest. SwiftPM also checks
the binary ZIP against its <code>.swiftpm-checksum</code>. The platform privacy files are separately named so each build's
feature selection and provenance remain explicit; their contents match when their privacy-relevant features match.</p>
<p>Place the Swift binding and the privacy asset in the existing Swift wrapper target, renaming them to <code>MarmotKit.swift</code>
and <code>PrivacyInfo.xcprivacy</code>. Preserve the SDK declaration separately from the host application's own privacy manifest.
The wrapper target must declare:</p>
<pre><code class="language-swift">.target(
    name: &quot;MarmotKit&quot;,
    dependencies: [&quot;MarmotKitFFI&quot;],
    resources: [.copy(&quot;PrivacyInfo.xcprivacy&quot;)],
    linkerSettings: [
        .linkedFramework(&quot;Security&quot;, .when(platforms: [.macOS])),
        .linkedFramework(&quot;SystemConfiguration&quot;, .when(platforms: [.macOS]))
    ]
)
</code></pre>
<p>Assign that wrapper's product to each consuming app and notification extension. Do not add an extra host-compiled copy
of the generated Swift. SwiftPM delivers the target's manifest in a resource bundle; Rust remains statically linked
into each executable. No additional complete-package ZIP or new Rust binary is published. Existing provenance bundle
ZIPs include all three inputs plus <code>manifest.json</code>, but are not themselves binary-target archives.</p>
<p>Platform manifests identify this layout with <code>distribution: static-library-and-privacy-v1</code> and hash the privacy asset
alongside Swift, the ZIP and each static library. Keep all inputs on one identifier; automate their synchronization.
Consumers of 0.10.0 and earlier retain the old framework layout. No published release is modified. Direct Xcode
consumers must provide and validate an equivalent SDK resource bundle or use the Swift wrapper.</p>
<p>Release CI builds a simulator consumer and archives iOS app/notification-extension and macOS consumers from the
released ZIP, matching Swift and privacy assets. It checks resource content in each consumer, unchanged static
linkage, real Rust references, executable/dSYM UUIDs, and absence of the empty framework stub. The fixture uses a local
binary target after checking the downloaded ZIP's hash; existing remote SwiftPM link checks still exercise the URL and
checksum path. Signed export, Organizer privacy report and App Store Connect upload remain separate host checks.
Rust source-level debug information is unchanged and belongs in the crash-symbol PR.</p>
<p><a href="https://github.com/marmot-protocol/mdk/issues/1874">Consumer migration tracking</a> records downstream adoption and host
release evidence. See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/apple-privacy/README.md">privacy audit and adoption guide</a> for outstanding privacy questions.</p>
<h2 id="ios">iOS</h2>
<p>The iOS binary asset carries no platform token in its name, for backward compatibility with URLs consumers already
pin. macOS assets are explicitly prefixed <code>-macos-</code>; an unprefixed <code>MarmotKitFFI-&lt;identifier&gt;</code> asset is always iOS.</p>
<h3 id="exact-urls">Exact URLs</h3>
<p>Formal release <code>marmotkit-v&lt;version&gt;</code>:</p>
<pre><code class="language-text">https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/MarmotKitFFI-&lt;version&gt;.xcframework.zip
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/MarmotKit-&lt;version&gt;.swift
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/PrivacyInfo-ios-&lt;version&gt;.xcprivacy
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/PrivacyInfo-ios-&lt;version&gt;.xcprivacy.sha256
</code></pre>
<p>Snapshot for a full 40-character commit SHA <code>&lt;sha&gt;</code> reachable from <code>master</code>:</p>
<pre><code class="language-text">https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/MarmotKitFFI-snapshot-&lt;sha&gt;.xcframework.zip
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/MarmotKit-snapshot-&lt;sha&gt;.swift
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/PrivacyInfo-ios-snapshot-&lt;sha&gt;.xcprivacy
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/PrivacyInfo-ios-snapshot-&lt;sha&gt;.xcprivacy.sha256
</code></pre>
<p>A nightly <code>&lt;X.Y.Z&gt;-nightly.&lt;YYYYMMDD&gt;</code> uses the same names under the <code>marmotkit-v&lt;X.Y.Z&gt;-nightly.&lt;YYYYMMDD&gt;</code> tag; see
<a href="#nightlies">Nightlies</a>.</p>
<p>These URLs always contain an exact tag or snapshot identifier. Do not use a <code>latest</code> URL for SwiftPM artifacts.</p>
<h3 id="swiftpm">SwiftPM</h3>
<p>Follow the <a href="#apple-privacy-migration">privacy migration</a> as well as this binary declaration; the binary alone does not
carry the SDK privacy resource.</p>
<p>Download the sibling <code>.swiftpm-checksum</code> asset or read the <code>swiftpm</code> record in
<code>marmotkit-ios-&lt;identifier&gt;.checksums.txt</code>, then declare:</p>
<pre><code class="language-swift">.binaryTarget(
    name: &quot;MarmotKitFFI&quot;,
    url: &quot;&lt;exact URL above&gt;&quot;,
    checksum: &quot;&lt;contents of .swiftpm-checksum&gt;&quot;
)
</code></pre>
<p>The consuming Swift package must declare iOS 18.0 or newer. The labeled records in <code>checksums.txt</code> are intended for
inspection and provenance; they are not <code>shasum -c</code> input. Use the sibling <code>.sha256</code> files for ordinary SHA-256
verification.</p>
<p>Add the matching <code>MarmotKit-&lt;identifier&gt;.swift</code> file to a Swift source target that depends on <code>MarmotKitFFI</code>. Update
the binary URL, checksum, generated Swift source, and platform privacy file together. Mixing source and binary identifiers can compile
against the wrong UniFFI ABI and is unsupported.</p>
<p>For manual verification, compare the ZIP with its <code>.sha256</code> asset. The separately published
<code>marmotkit-ios-&lt;identifier&gt;.manifest.json</code> records the full MDK source SHA, workspace version, <code>Cargo.lock</code> SHA-256,
toolchain versions, enabled features, iOS targets and deployment target, effective Rust release profile, and hashes
of the binary and generated Swift artifacts. <code>rust_release_profile.lto</code> follows Cargo's boolean-or-string
representation: JSON <code>false</code> for the historical untuned control, and the string <code>&quot;thin&quot;</code> for current production.
Codegen units remain an integer. Host and Apple artifacts keep <code>strip</code> as <code>&quot;none&quot;</code>; Android JNI builds apply
<code>symbols</code> only on those target invocations. Apple builders also pass <code>-C embed-bitcode=no</code> and sanitize leftover
Mach-O <code>__LLVM</code> / <code>__bitcode</code> sections so packaged archives stay native; that is not recorded as a <code>strip</code>
change. The complete <code>marmotkit-ios-&lt;identifier&gt;.zip</code> retains the XCFramework,
matching Swift source, <code>PrivacyInfo.xcprivacy</code>, and the same manifest for consumers that prefer a single provenance bundle.</p>
<h2 id="macos">macOS</h2>
<p>macOS artifacts are Apple Silicon only: the XCFramework carries a single <code>macos-arm64</code> slice built for
<code>aarch64-apple-darwin</code>. There is no Intel or universal build.</p>
<h3 id="exact-urls-1">Exact URLs</h3>
<p>Formal release <code>marmotkit-v&lt;version&gt;</code>:</p>
<pre><code class="language-text">https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/MarmotKitFFI-macos-&lt;version&gt;.xcframework.zip
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/PrivacyInfo-macos-&lt;version&gt;.xcprivacy
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/PrivacyInfo-macos-&lt;version&gt;.xcprivacy.sha256
</code></pre>
<p>Snapshot for a full 40-character commit SHA <code>&lt;sha&gt;</code> reachable from <code>master</code>:</p>
<pre><code class="language-text">https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/MarmotKitFFI-macos-snapshot-&lt;sha&gt;.xcframework.zip
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/PrivacyInfo-macos-snapshot-&lt;sha&gt;.xcprivacy
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/PrivacyInfo-macos-snapshot-&lt;sha&gt;.xcprivacy.sha256
</code></pre>
<h3 id="swiftpm-1">SwiftPM</h3>
<p>Follow the <a href="#apple-privacy-migration">privacy migration</a> as well as this binary declaration; the binary alone does not
carry the SDK privacy resource.</p>
<p>Download the sibling <code>.swiftpm-checksum</code> asset or read the <code>swiftpm</code> record in
<code>marmotkit-macos-&lt;identifier&gt;.checksums.txt</code>, then declare:</p>
<pre><code class="language-swift">.binaryTarget(
    name: &quot;MarmotKitFFI&quot;,
    url: &quot;&lt;exact URL above&gt;&quot;,
    checksum: &quot;&lt;contents of .swiftpm-checksum&gt;&quot;
)
</code></pre>
<p>The consuming Swift package must declare macOS 15.0 or newer, and the target that wraps the binary links <code>Security</code>
and <code>SystemConfiguration</code>.</p>
<h3 id="generated-swift-is-shared-with-ios">Generated Swift is shared with iOS</h3>
<p>There is no <code>MarmotKit-macos-&lt;identifier&gt;.swift</code> asset, and looking for one is the common mistake. The generated Swift
binding is platform-independent and published exactly once per release, by the iOS job, as
<code>MarmotKit-&lt;identifier&gt;.swift</code>. Use that same file for a macOS consumer, from the same release identifier as the macOS
binary. <code>marmotkit-macos-&lt;identifier&gt;.manifest.json</code> records its SHA-256 so a macOS consumer can verify it without
consulting the iOS manifest, and publishing fails if the two jobs ever generate different Swift from one source SHA.</p>
<p>For the same reason, <code>marmotkit-macos-&lt;identifier&gt;.checksums.txt</code> carries a <code>sha256</code> line for
<code>MarmotKit-&lt;identifier&gt;.swift</code> even though that file is not a macOS release asset — the line lets a macOS consumer
verify the shared Swift from the macOS checksums file alone. A verifier that walks that file expecting every named
entry to exist among the macOS assets must skip this one.</p>
<p>For manual verification, compare the ZIP with its <code>.sha256</code> asset. The separately published
<code>marmotkit-macos-&lt;identifier&gt;.manifest.json</code> records the full MDK source SHA, workspace version, <code>Cargo.lock</code> SHA-256,
toolchain versions, enabled features, macOS targets and deployment target, effective Rust release profile, and hashes
of the binary and shared generated Swift artifacts. <code>rust_release_profile.lto</code> is Cargo's boolean-or-string value
(<code>false</code> or <code>&quot;thin&quot;</code>); codegen units remain an integer. Apple builders pass <code>-C embed-bitcode=no</code> and sanitize leftover
Mach-O <code>__LLVM</code> / <code>__bitcode</code> sections; that is not a <code>strip</code> change. The complete <code>marmotkit-macos-&lt;identifier&gt;.zip</code> retains the
XCFramework, matching Swift source, <code>PrivacyInfo.xcprivacy</code>, and the same manifest for consumers that prefer a single provenance bundle.</p>
<h2 id="android">Android</h2>
<p>Android bundles contain generated Kotlin, the required Android initialization helpers, and JNI libraries for
<code>arm64-v8a</code>, <code>armeabi-v7a</code>, <code>x86</code>, and <code>x86_64</code>.</p>
<h3 id="exact-urls-2">Exact URLs</h3>
<p>Formal release <code>marmotkit-v&lt;version&gt;</code>:</p>
<pre><code class="language-text">https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/marmotkit-android-&lt;version&gt;.zip
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-v&lt;version&gt;/marmotkit-android-&lt;version&gt;.zip.sha256
</code></pre>
<p>Snapshot for a full 40-character commit SHA <code>&lt;sha&gt;</code> reachable from <code>master</code>:</p>
<pre><code class="language-text">https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/marmotkit-android-snapshot-&lt;sha&gt;.zip
https://github.com/marmot-protocol/mdk/releases/download/marmotkit-snapshot-&lt;sha&gt;/marmotkit-android-snapshot-&lt;sha&gt;.zip.sha256
</code></pre>
<p>The archive has a <code>marmotkit-android-&lt;identifier&gt;</code> root containing:</p>
<ul>
<li><code>kotlin/dev/ipf/marmotkit/marmot_uniffi.kt</code></li>
<li><code>kotlin/dev/ipf/marmotkit/MarmotAndroid.kt</code></li>
<li><code>kotlin/io/crates/keyring/Keyring.kt</code></li>
<li><code>jniLibs/&lt;abi&gt;/libmarmot_uniffi.so</code> for each supported ABI</li>
<li><code>android-elf.json</code></li>
<li><code>manifest.json</code></li>
</ul>
<p><code>arm64-v8a</code> and <code>x86_64</code> libraries are linked so every ELF <code>PT_LOAD</code> segment is aligned to at least 16 KB.
The linker flags are extra arguments on the final library build, so configured Cargo rustflags remain in effect.
<code>armeabi-v7a</code> and <code>x86</code> stay on the NDK default page size. The four ABIs and the Kotlin API are unchanged.
<code>android-elf.json</code> is a schema-1 report of the packaged bytes: each <code>jniLibs/&lt;abi&gt;/libmarmot_uniffi.so</code> entry has
the library's lowercase SHA-256, ELF class, machine, and ordered <code>PT_LOAD</code> alignments. Compare those hashes with
the files you stage. ZIP alignment of an app bundle does not repair a library whose load segments are still 4 KB.</p>
<p>Verify the archive against its sibling <code>.sha256</code> before extracting it. Update the generated Kotlin helpers and all
JNI ABI libraries together; mixing identifiers can cross an incompatible UniFFI ABI. The manifest records both the
exact packaged source SHA and the workflow builder SHA. Its ordered <code>contents</code> contract lists the generated UniFFI
Kotlin source and JNI libraries; the two required hand-written initialization helpers remain validated archive
payloads but do not change that existing consumer-facing API contract. <code>elf_validation</code> names <code>android-elf.json</code>
without adding that report to <code>contents</code>. Exact-head candidate packages from the release-profile workflow include
the same report beside <code>manifest.txt</code> and the build provenance. Publishing a new formal or snapshot artifact, and
adopting it in an Android app, remains a separate release step.</p>
<h2 id="nightlies">Nightlies</h2>
<p>Each day's nightly publishes the iOS, macOS and Android assets above under a dated pre-release, for example
<code>marmotkit-v0.14.0-nightly.20261020</code> with <code>MarmotKitFFI-0.14.0-nightly.20261020.xcframework.zip</code> and
<code>marmotkit-android-0.14.0-nightly.20261020.zip</code>. The identifier works exactly like a formal version: keep the binary,
Swift, privacy and Android inputs on one identifier and verify the same checksums. The manifests record the nightly as
<code>release_identifier</code>, master's <code>X.Y.Z-dev</code> as the workspace version, and the exact source SHA.</p>
<p>Use nightlies only for testing. Pin a formal <code>marmotkit-v&lt;version&gt;</code> release for anything you ship. Nightlies are deleted
after 30 days, so a nightly pin stops resolving, and going back to an older nightly is not supported. To find the newest
nightly, read <code>latest.json</code> on the <code>nightly-meta</code> branch:</p>
<pre><code class="language-text">https://raw.githubusercontent.com/marmot-protocol/mdk/nightly-meta/latest.json
</code></pre>
<p>It lists every asset's URL and SHA-256 for MarmotKit, Marmot C and WN Agent. See
<a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#nightly-builds">nightly builds</a> for naming, publication and retention.</p>
<h2 id="publishing">Publishing</h2>
<p>Pushing a formal <code>marmotkit-v*</code> tag publishes iOS, macOS, and Android bindings. To publish an untagged snapshot, run
the <code>MarmotKit Bindings</code> workflow with a full SHA on <code>master</code>. Its immutable release tag is derived from that SHA.
Snapshots publish the iOS, macOS, and Android bindings from the same source SHA.</p>
<p>Set the dispatch input <code>build_only=true</code> to build and validate workflow artifacts
without publishing. This also permits testing the workflow on a development
branch. Publishing retains the <code>master</code> workflow/source-ancestry restrictions.
See <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/release.md#parallel-builds-and-build-only-rehearsals">parallel builds and rehearsals</a>
for phase boundaries, concurrency limits and evidence scope.</p>
<p>Publishing first uploads and verifies every asset on a draft, then publishes it under repository-enforced immutable
releases. A retry discards only an incomplete draft. Publishing fails if a public release already exists, and snapshot
publishing also fails if its derived tag already exists. Assets and snapshot tags are never replaced or moved; a
changed build requires a new formal version or a new source SHA.</p>
<p>Each platform manifest records both the packaged source SHA and the workflow builder SHA. Snapshot dispatches must use
the workflow from <code>master</code>, so an older reachable source commit cannot substitute its own packaging logic. The
builder SHA also owns the canonical Rust release profile and compiled-in public endpoint defaults. Source-coupled
inputs—including the Cargo workspace, UniFFI configuration, and Kotlin support files—come from the packaged source
SHA so the generated API and JNI libraries remain a matched set.</p>
<h2 id="apple-privacy-resources">Apple privacy resources</h2>
<p>Apple exporters publish raw static libraries and the reviewed SDK manifest as separate matching release inputs.
The consuming Swift wrapper owns the privacy resource. See the <a href="https://github.com/marmot-protocol/mdk/blob/827687ba7fdbb05ec1b8f17667ad919fedde7266/crates/marmot-uniffi/apple-privacy/README.md">privacy audit and adoption guide</a>
for declarations, archive validation and unresolved release questions.</p>
`,f={__name:"distribution.html",setup(h){return(p,a)=>{const o=r("DocumentationPage");return s(),i("div",null,[a[0]||(a[0]=t("h1",{id:"marmotkit-distribution",tabindex:"-1"},[t("a",{class:"header-anchor",href:"#marmotkit-distribution"},[t("span",null,"MarmotKit distribution")])],-1)),n(o,{document:{repo:e(c),version:e(d),sourceUrl:e(l),html:e(m)}},null,8,["document"])])}}},g=JSON.parse('{"path":"/docs/distribution.html","title":"MarmotKit distribution","lang":"en-US","frontmatter":{"title":"MarmotKit distribution","description":"MarmotKit distribution — guides synced from the latest published Marmot releases.","pageClass":"mm-docs","editLink":false,"sidebarDepth":0},"git":{"contributors":[{"name":"Vladimir Krstic","username":"","email":"hello@vladimir.design","commits":1}],"changelog":[{"hash":"c888f0667b4e8801123658fa88f21a9a1ee5c7b5","time":1794346037000,"email":"hello@vladimir.design","author":"Vladimir Krstic","message":"Refresh Marmot website and sync ecosystem content"}]},"filePathRelative":"docs/distribution.md"}');export{f as comp,g as data};
