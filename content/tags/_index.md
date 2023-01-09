---
title: "tags"
layout: "terms"
type: 'tags'
--- 
{{- define "tags" -}}

{{- if .Title }}
<header class="page-header">
    <h1>{{ .Title }}</h1>
    {{- if .Description }}
    <div class="post-description">
        {{ .Description }}
    </div>
    {{- end }}
</header>
{{- end }}

{{- end }}
