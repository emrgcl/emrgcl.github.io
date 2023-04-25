---
layout: post
title: "Leveraging ChatGPT to Export PowerPoint Tables to Markdown"
date: 2023-04-24
categories: [AI, GPT-4, PowerPoint, Markdown]
---

In this blog post, I will share my experience of leveraging ChatGPT to create a Visual Basic macro that helped me export tables from a PowerPoint slide deck to a Markdown file.

## The Challenge

I was in the midst of preparing a slide deck for an Infrastructure as Code Bootcamp scheduled for May. My presentation included numerous tables containing commands and sample code that I wanted to share with the audience and use in my blog posts. I needed a quick and efficient way to export these tables as a Markdown file, but I was unsure of how to achieve this.

<!--more-->

## Turning to ChatGPT

Given the challenge at hand, I decided to seek help from ChatGPT, a powerful AI language model designed to assist users in various tasks, including programming.

<div class='chat-container'>
   <div class='message user'>
     <span class='content'>
        Hey ChatGPT, I need a PowerPoint macro that will find every table in the slide deck and export them to a Markdown file with the Cascadia font as code highlights in Markdown. Can you help me with that?
     </span>
   </div>
   <div class='message assistant'>
     <span class='content'>
      Of course! Here's a VBA macro that does exactly that:
      {% highlight vb %}
Option Explicit

    Sub ExportTablesToMarkdown()
        Dim Slide As Slide
        Dim Shape As Shape
        Dim Table As Table
        Dim Cell As Cell
        Dim Row As Long, Col As Long
        Dim MarkdownContent As String
        Dim FilePath As String
        Dim TargetFont As String
        
        ' Set output file path
        FilePath = "C:\temp\TablesInMarkdown3.md" ' Change the file path as needed
        TargetFont = "Cascadia Code"
        
        ' Loop through slides
        For Each Slide In ActivePresentation.Slides
            ' Loop through shapes
            For Each Shape In Slide.Shapes
                ' Check if the shape is a table
                If Shape.HasTable Then
                    Set Table = Shape.Table
                    ' Loop through rows and columns
                    For Row = 1 To Table.Rows.Count
                        For Col = 1 To Table.Columns.Count
                            Set Cell = Table.Cell(Row, Col)
                            ' Check if the font is Cascadia Code
                            If Cell.Shape.TextFrame.TextRange.Font.Name = TargetFont Then
                                ' Add cell content as markdown with code highlighting
                                MarkdownContent = MarkdownContent & "|" & " `" & Cell.Shape.TextFrame.TextRange.Text & "` "
                            Else
                                ' Add cell content as markdown without code highlighting
                                MarkdownContent = MarkdownContent & "|" & " " & Cell.Shape.TextFrame.TextRange.Text & " "
                            End If
                            If Col = Table.Columns.Count Then
                                MarkdownContent = MarkdownContent & "|"
                            End If
                        Next Col
                        ' Add a new line
                        MarkdownContent = MarkdownContent & vbCrLf
                        
                        ' Add header separator after the first row
                        If Row = 1 Then
                            For Col = 1 To Table.Columns.Count
                                MarkdownContent = MarkdownContent & "|---"
                            Next Col
                            MarkdownContent = MarkdownContent & "|"
                            MarkdownContent = MarkdownContent & vbCrLf
                        End If
                    Next Row
                    
                    ' Add a separator for multiple tables
                    MarkdownContent = MarkdownContent & vbCrLf & "---" & vbCrLf & vbCrLf
                End If
            Next Shape
        Next Slide
        
        ' Save markdown content to a file
        SaveToFile FilePath, MarkdownContent
        MsgBox "Tables exported to Markdown file successfully!", vbInformation
    End Sub

    Sub SaveToFile(FilePath As String, Content As String)
        Dim Stream As Object
        
        ' Write file using UTF-8 encoding
        Set Stream = CreateObject("ADODB.Stream")
        Stream.Type = 2 ' adTypeText
        Stream.Charset = "UTF-8"
        Stream.Open
        Stream.WriteText Content
        Stream.SaveToFile FilePath, 2 ' adSaveCreateOverWrite
        Stream.Close
    End Sub



      {% endhighlight %}
     

    </span>
   </div>
</div>


To use this macro, follow these high-level steps:

1. Open your PowerPoint presentation.
1. Press `Alt` + `F11` to open the VBA editor.
1. Click on `Insert` in the menu and then click on `Module`.
1. Paste the provided VBA code into the newly created module.
1. Close the VBA editor.
1. Press `Alt` + `F8` to open the "Macro" dialog.
1. Select the `ExportTablesToMarkdown` macro and click "Run".

## Understanding the Code

After receiving the code from ChatGPT, I had a few questions to ensure I understood the functionality and implementation.

<div class='chat-container'>
   <div class='message user'>
     <span class='content'>
      Can you explain how the macro checks if the font in the cell is the same as the `TargetFont` (Cascadia Code)?
     </span>
   </div>
   <div class='message assistant'>
     <span class='content'>
      Sure! The macro uses an `If` statement to compare the font name in the current cell with the `TargetFont` variable, which is set to "Cascadia Code". If the font names match, the cell content is added to the `MarkdownContent` string with code formatting (using backticks). If the font is not the `TargetFont`, the cell content is added without code formatting.
     </span>
   </div>
</div>


## The Outcome

With ChatGPT's assistance, I successfully created a VBA macro that allowed me to export the tables from my PowerPoint slides to a Markdown file (in this case it is =>  `FilePath = "C:\temp\TablesInMarkdown3.md"`). This not only enabled me to share the sample code with my audience but also made it easy to incorporate the code into my blog posts.

The experience of leveraging ChatGPT was incredible, as it helped me overcome a challenge in a time-efficient manner. If you ever find yourself in need of assistance, whether it's programming or any other task, don't hesitate to give ChatGPT a try!
