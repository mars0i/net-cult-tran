var citation=function(){var t=function(t){var e=t.attr("id").substring("cite-post-".length),o=t.parent().parent(),a="cite-popup-"+e,n="bibradio-"+e,i="amsradio-"+e,s="reftype-"+e,c="cite-example-"+e,r="cite-textarea-"+e;$("#"+a).remove();var u='<div id="'+a+'" class="popup" style="width:700px;cursor:auto;display:block;"><div id="'+c+'"></div><input type="radio" id="'+n+'" name="'+s+'" checked="checked"> BibTeX</input> <input type="radio" id="'+i+'" name="'+s+'"> amsrefs</input> <textarea id="'+r+'" rows="9" style="width:100%;"></textarea><br><p align="right"><a class="cite-close">close</a></p></div>',p=$(u);p.find("a.cite-close").click(function(){p.fadeOutAndRemove()}),o.append(p),StackExchange.helpers.addSpinner(p),$.ajax({"type":"GET","url":"/posts/"+e+"/citation","dataType":"json","success":function(t){StackExchange.helpers.removeSpinner(),$("#"+c).html(t.example),$("#"+r).val(t.bibtex),$("#"+n).data("ref",t.bibtex).click(function(){$("#"+r).val($("#"+n).data("ref"))}),$("#"+i).data("ref",t.amsref).click(function(){$("#"+r).val($("#"+i).data("ref"))})}})};return{"show":function(e){t(e)}}}();