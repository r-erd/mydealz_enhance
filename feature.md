Ich möchte ein Feature, mit dem ich einzelne Threads in einer Listview identifizieren und spzifisch ausblenden kann.

Hierzu soll es einen Button "Hide 🙈" in jedem Thread-Artikel geben. Der Button soll innerhalb der "threadListCard-header-action" rechts neben neben den bestehenden elementen angezeigt werden.
Wenn ich diesen Button klicke, soll der entsprechende Thread ausgeblendet werden und seine Thread-ID in einer Blacklist gespeichert werden.
Die Blacklist soll in `chrome.storage.local` unter dem Schlüssel "hiddenThreads" als Array von Thread-IDs gespeichert werden. 
Beim Laden der Seite soll die Blacklist ausgelesen werden und alle Threads, deren Thread-ID in der Blacklist enthalten ist, sollen ausgeblendet werden.

Um alle Threads wieder einzublenden, soll es im Extension-Popup einen Button "Unhide all threads" geben, der die Blacklist leert und alle Threads wieder sichtbar macht.

Um die Thread-ID eines Artikels zu bestimmen, kann folgende Information genutzt werden:
Einzelne Artikel in der Listview haben folgende Struktur:
<article id="thread_2668614" .....>....</article>
Die ID des Artikels setzt sich zusammen aus dem Präfix "thread_" und der Thread-ID.

Das HTML für die "threadListCard-header-action" sieht beispielsweise so aus:
<div class="threadListCard-header-action"><div class="box--contents"><div class="vote-box bRad--a space--h-1 bRad--circle vote-box--change fadeOuterEdge--r vote-box--toW3-onGrey"><button class="vote-button overflow--visible vote-button--primary vote-button--mode-down vote-button--with-animation" title="Nicht überzeugt? Gib einen negativen Vote." data-t-click="ocular,recombee" data-t="temperature"><!----><span class="vote-icon flex boxAlign-jc--all-c"><svg width="18" height="16" class="icon icon--arrow-rounded-down"><use xlink:href="/assets/img/ico_45f47.svg#arrow-rounded-down"></use></svg></span><!----><!----></button><button class="cept-vote-temp vote-temp space--l-half-1 vote-temp--burn size--all-m space--mh-1" title="Derzeit bewertet mit 2327°. Dein Vote verändert die Temperatur!"><span class="overflow--wrap-off">2327°</span><!----></button><button class="vote-button overflow--visible vote-button--primary vote-button--mode-up vote-button--with-animation" title="Guter Deal? Gib ihm einen Schub!" data-t-click="ocular,recombee" data-t="temperature"><!----><span class="vote-icon flex boxAlign-jc--all-c"><svg width="18" height="16" class="icon icon--arrow-rounded-up"><use xlink:href="/assets/img/ico_45f47.svg#arrow-rounded-up"></use></svg></span><!----><!----></button><!----><!----></div></div></div>
