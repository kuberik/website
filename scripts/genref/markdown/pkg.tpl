{{ define "packages" -}}

{{ range .packages -}}

{{- end -}}

{{ range .packages }}

## {{ .Title }}
{{ .GetComment | html }}
  {{ if ne .GroupName "" -}}

    {{/* For package with a group name, list all type definitions in it. */}}
    {{ range .VisibleTypes }}
      {{- if or .IsExported -}}
{{ template "type" . }}
      {{- end -}}
    {{ end }}

### Definitions

    {{ range .VisibleTypes }}
      {{- if and .Referenced (not .IsExported) -}}
{{ template "type" . }}
      {{- end -}}
    {{ end }}
  {{ else }}
    {{/* For package w/o group name, list only types referenced. */}}
    {{- range .VisibleTypes -}}
      {{- if and .Referenced (not .References) -}}
{{ template "type" . }}
      {{- end -}}
    {{- end }}

### Definitions

    {{ range .VisibleTypes }}
      {{- if and .Referenced .References -}}
{{ template "type" . }}
      {{- end -}}
    {{ end }}
  {{- end }}
{{- end }}
{{- end }}
