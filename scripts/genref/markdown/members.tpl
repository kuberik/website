{{ define "members" }}
  {{/* . is a apiType */}}
  {{- range .GetMembers -}}
    {{/* . is a apiMember */}}
    {{- if not .Hidden }}
<tr id="{{ $.Anchor }}-{{ .FieldName }}"><td><code>{{ .FieldName }}</code>
      {{/* a {{- if not .IsOptional }} <B>[Required]</B>{{- end -}} */}}
<br/>
{{/* Link for type reference */}}
      {{- with .GetType -}}
        {{- if .Link -}}
<a href="{{ .Link }}"><code>{{ .DisplayName }}</code></a>
        {{- else -}}
<code>{{ .DisplayName }}</code>
        {{- end -}}
      {{- end }}
</td>
<td>
   {{- if .IsInline -}}
(Members of <code>{{ .FieldName }}</code> are embedded into this type.)
   {{ end -}}
   {{- .GetComment -}}
</td>
</tr>
    {{- end }}
  {{- end }}
{{ end }}
