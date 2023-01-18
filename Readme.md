# Recommandation de centres d'intérêts aux utilisateurs de Diagoriente

## Vue d'ensemble

**Contexte:** Lors de son parcours sur Diagoriente, un utilisateur est amené à
sélectionner ses centres d'intérêts (CI) parmis 154 disponibles pour lui
présenter des métiers susceptibles de l'intéresser. Chaque CI est annoté sur 6
axes avec une valeur entre -10 et 10, ou la valeur NA lorsque ce CI n'a pas de
valeur associée à cet axe. Ces valeurs sont invisibles pour les
utilisateurs mais sont utilisées pour faire des recommandations. Les axes sont:

- Affaire—Assistance
- Innovation—Règlementation
- Collectif—Individuel
- Liberté créative—Cadre
- Confort—Effort Physique
- Conceptuel—Concrêt

**Objectif:** permettre aux utilisateurs de Diagoriente de trouver plus
rapidement leurs centres d'intérêts qu'en énumérant les 154 disponibles.

**Proposition:**

1. On présente d'abord à un utilisateur un CI séléctionné aléatoirement et on
   lui demande si ce CI l'intéresse. Si non, on recommence avec un autre CI
   choisi aussi aléatoirement jusqu'à ce qu'il réponde oui.
2. On présente ensuite 3 listes de CI en fonction de celui déjà sélectionné: une
   liste de CI proches, une liste de CI d'ouverture (proches sur tous les axes
   sauf un), une liste de CI éloignés. On lui demande de choisir un CI.
3. Dès que l'utilisateur choisit un CI, on le mémorise et on met à jour les
   trois listes de CI en fonction de ceux précédemment choisis.
4. L'utilisateur a la possibilité à tout moment de quitter le processus de choix
   des CI pour voir les métiers qui lui sont recommandés à partir des CI qu'il a
   séléctionnés jusque là.

**Hypothèses:**

- Un utilisateur a une unique valeur préférée sur chaque axe.
- La moyenne des coefficients des centres d'intérêts sélectionnés à un instant
  donné est une approximation des préférences de l'utilisateur.

## Données d'entrées

Les données d'entrées sont les valeurs de chaque CI sur chaque axe. Différentes
versions du jeu de données sont disponibles dans le répertoire `data/cotations`.
Le jeu de données actuel à utiliser est `data/cotations/2022-03-24_ACP.csv`. Il
a été créé en transformant par analyse en composante principale (ACP) le jeu
`data/cotations/2022-03-24.csv`. Ce dernier a été créé par une annotation
manuelle des CI sur chaque axe.


## Formalisation de la méthode

Les listes de CI proches, d'ouverture et éloignés présentées à l'utilisateurs
sont constituées en fonction des préférences de l'utilisateurs, c'est-à-dire sa
valeur préférée sur chaque axe. Ces préférences sont inconnues et la méthode
vise à en construire une approximation à partir des CI que l'utilisateur
sélectionne successivement. Il y a donc une boucle entre la construction de
l'approximation et la suggestion de CI. Au fur et à mesure des sélections de CI
par l'utilisateur, la méthode affine l'approximation de ses préférences, suggère
de nouveaux CI et recommence.

Les préférences d'un utilisateur sont représentées par un vecteur 
$\vec\theta = (\theta_{1}, \dots, \theta_{d})$, ou $d$ est le nombre d'axes
et $\theta_{i}$ la position préférée par l'utilisateur sur l'axe $i$.

L'utilisateur est amené à sélectionner successivement des centres d'intérêts, on
note la séquence des centres d'intérêts sélectionnés par 
$(\vec c_t)_{1 <= t <= N}$ où $N = 154$ est le nombre de CI.

Après chaque sélection, on approxime $\vec\theta$ en prenant la moyenne des CI
sélectionnés jusque là en ignorant les NA. L'estimateur à l'étape $t$ est noté
$\vec\theta_t = (\theta_{t1},\theta_{t2},\dots,\theta_{td})$ et :

$$
\theta_{tj} = {
  {\displaystyle
    \sum_{\substack{i, 1 \le i \le t, \\ c_{ij} \ne \mathrm{NA}}}
    \vec c_{ij}
  }
  \over 
  |\{i, c_{ij} \ne \mathrm{NA}\}|}.
$$

Si tous les CI sélectionnés valent $\mathrm{NA}$ sur un axe $j$, alors 
$\theta_{tj} = NA$.

Pour recommander des centres d'intérêts proches ou éloignés des préférences d'un
utilisateur, on utilise comme mesure de proximité entre un centre d'intérêt
$\vec c = (c_1, \dots, c_d)$ et les préférences $\vec\theta_t$ la différence 
absolue moyennée sur tous les axes, en ignorant les $\mathrm{NA}$ :

$$
\operatorname{prox}(\vec c, \vec\theta_t) = {
  {\displaystyle\sum_{1 \le j \le d} |c_j - \theta_{tj}|}
  \over
  {|\{j, c_j \ne \mathrm{NA} \textrm{ et } \theta_{tj} \ne \mathrm{NA}\}|}.
}
$$

Les CI proches à l'instant $t$ sont donnés du plus proches au plus éloignés par
la séquence des CI $C^P_t = (c_i)_{1 \le i \le N}$ triés par 
$\operatorname{prox}(\vec c, \vec\theta_t)$ croissant. Les CI éloignés à 
l'instant $t$ sont donnés par cette même séquence prise dans l'ordre inverse.

Pour recommander des centres d'intérêts d'ouverture, on cherche les centres
d'intérêts proches des préférences de l'utilisateur sur tous les axes sauf un. 
Le vecteur $\vec e = (e_1, \dots, e_d)$ où $e_j = |c_j - \theta_j|$ si 
$c_j, \theta_j \ne \mathrm{NA}$ et $e_j = \mathrm{NA}$ sinon, donne la
distance entre un CI considéré et les préférences de l'utisateur sur chaque axe.
On prend alors pour score d'ouverture :

$$
\operatorname{ouv}(\vec c, \vec\theta_t) = \max_{1 \le j \le d}{
  d_j
  \over
  1 + \displaystyle\sum_{j' \in J'=\{j', 1 \le j' \le d, j' \ne j, d_{j'} \ne \mathrm{NA}\}} \frac{d_{j'}}{|J'|}
}
$$

Ce score augmente plus une valeur sur l'un des axe est grande et toutes les
autres petites.

Les CI d'ouverture à l'instant $t$ sont donnés par la séquence des CI 
$C^O_t = (c_i)_{1 \le i \le N}$ triés par 
$\operatorname{ouv}(\vec c, \vec\theta_t)$ décroissant.


## Algorithme

### Recommandation de centres d'intérêts

L'objectif de l'algorithme est d'aider un utilisateur à choisir des centres
d'intérêts (CI) en lui proposant 3 listes : des CI proches des siens, éloignés
et d'ouverture. L'approche consiste à itérer autant de fois que nécessaire la
procédure suivante :

1. on propose à l'utilisateur un nombre prédéfini des CI proches, d'ouverture et
   distants,
2. il en sélectionne un que l'on ajoute à une liste des CI sélectionnés au cours
   des itérations précédentes,
3. on calcule les scores de proximité et d'ouverture de l'ensemble des CI en
   fonction des CI sélectionnés,
4. on constitue à partir de ces scores les nouvelles listes de CI proches,
   distants et d'ouverture.

À la première itérations, comme l'utilisateur n'a encore sélectionné aucun
CI, nous n'avons aucune information sur ses préférences. On lui propose alors
pour commencer des listes de CI aléatoires.

Les calculs de scores de proximité et d'ouverture dépendent des valeurs données
à chaque CI sur les axes listés au début du document. Chaque CI peut-être noté
de -10 à 10 sur chaque axe. Quand un CI n'est pas noté sur un axe, on utilise la
valeur `NaN`. Ces valeurs sont disponibles dans le fichier
`data/cotations/2022-03-24.csv` (un CI par ligne et un axe par colonne).

Le score de proximité d'un CI reflète sa distance sur chaque axe avec
la moyenne des CI sélectionnés par l'utilisateur. On calcule d'abord la
valeur moyenne par axe des CI sélectionnés en ignorant les `NaN`. Par exemple, à
la `2`-ième itération (l'utilisateur a sélectionné `2` CI), si les valeurs
associée à chacun des 6 axes pour les deux CI sont

```
ci_1 = [10, -10, NaN, 0, 0, NaN]
ci_2 = [0, 0, 10, 0, 0, NaN]
```

la moyenne vaut `ci_moy = [5, -5, 10, 0, 0, NaN]`. Le score de proximité d'un
autre CI `ci_3 = [5,5,5,5,5,5]` est calculé comme ça:

```
ci_moy = [5, -5, 10, 0, 0, NaN]
ci_3 = [5,5,5,5,5,5]
sum = 0
non_nan_count = 0
for i in 0 to 6:
    if ci_3[i] != NaN and ci_moy[i] != NaN
        sum = sum + abs(ci_3[i] - ci_moy[i])
        non_nan_count = non_nan_count + 1
result = sum / non_nan_count
```

Le score d'ouverture d'un CI est grand quand sa valeur sur 1 axe est loin de la
valeur moyenne des CI sélectionnés pour cet axe et que les valeurs sur tous les
autres axes sont proches. On le calcule comme ça:

```
ci_moy = [5, -5, 10, 0, 0, NaN]
ci_3 = [5,5,5,5,5,5]
ouv = 0
for i in 0 to 6:
    if ci_3[i] != NaN and ci_moy[i] != NaN:
        dist_i = abs(ci_3[i] - ci_moy[i])
        sum_dist = 0
        not_nan_count = 0
        for j in 0 to 6:
            if j != i and ci_3[j] != NaN and ci_moy[j] != NaN:
                dist_j = abs(ci_3[j] - ci_moy[j])
                sum_dist = sum_dist + dist_j
                not_nan_count += 1
        mean_dist = sum_dist / not_nan_count
        ouv_i = dist_i / (1 + mean_dist)
        if ouv_i > ouv:
            ouv = ouv_i
result = ouv
```

Les scores de proximité et d'ouverture servent ensuite à constituer les listes
de CI proches, distants et d'ouverture. On construit des listes de taille $L$
comme suit:

- la liste de CI proches contient les $L$ CI avec les plus petits scores de
  proximité qui n'ont pas déjà été sélectionnés par l'utilisateur ni déjà
  proposées 3 fois ou plus.
- la liste de CI d'ouverture contient les $L$ CI avec les plus grands scores
  d'ouverture qui n'ont pas déjà été sélectionnés par l'utilisateur ni déjà
  proposés 3 fois ou plus et qui n'apparaissent pas dans la liste précédente.
- la liste de CI distants contient les $L$ CI avec les plus petits scores de
  proximité qui n'ont pas déjà été sélectionnés par l'utilisateur ni déjà
  proposés 3 fois ou plus et qui n'apparaissent dans aucune des deux listes
  précédentes.

Ces listes sont reproposées à l'utilisateur pour une nouvelle sélection, et on
boucle.

Au fur et à mesure des itérations, lorsque l'utilisateur a sélectionné ou vu
un beaucoup de CI au moins 3 fois, il se peut qu'il ne reste plus suffisamment
de CI pour constituer des listes de taille $L$.


### Recommandation de métiers

On peut recommander à un utilisateur une liste de métiers qui correspondent aux
centres d'intérêts qu'il a sélectionnés.

Le fichier `data/métiers/2022-03-24.csv` fait la correspondance entre les
métiers (lignes) et les centres d'intérêts (colonnes). Pour chaque métier et
chaque centre d'intérêt, un coefficient entre 0 et 1 donne le degré
d'association entre les deux. 

Les métiers recommandés en premier sont ceux qui sont le plus associés aux
centres d'intérêt de l'utilisateur. Pour chaque métier on calcule un score qui
correspond à la somme des coefficients entre lui et les centre d'intérêt
sélectionné par l'utilisateur. C'est-à-dire :

```
# Exemple de centre d'intérêts (identifiants) sélectionnés par l'utilisateurs
cis = [57, 23, 42]

# List des métiers (identifiants)
metiers = [1, 2, 3, ...]

# Coefficients d'association. coef[m, c] donne la valeur du coefficient
# d'association entre le métier m et le centre d'intérêt c.
coef = ...

score = 0
for c in cis:
  for m in metiers:
    score = score + coef[m, c]

result = score
```

Les métiers triés par score décroissants forment la liste de recommandations.
Les métiers les plus recommandés apparaissent en premier.
