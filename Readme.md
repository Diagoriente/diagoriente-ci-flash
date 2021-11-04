# Recommandation de centres d'intérêts aux utilisateurs de Diagoriente

## Vue d'ensemble

**Contexte:** Lors de son parcours sur Diagoriente, un utilisateur est amené à
sélectionner ses centres d'intérêts (CI) parmis 154 disponibles pour lui
présenter des métiers susceptibles de l'intéresser. Chaque CI est annoté sur 7
axes avec une valeur entre -10 et 10. Ces valeurs sont invisibles pour les
utilisateurs mais sont utilisées pour faire des recommandations. Les axes sont:

- Affaire—Assistance
- Innovation—Règlementation
- Collectif—Individuel
- Liberté créative—Cadre
- Confort—Effort Physique
- Conceptuel—Concrêt
- Thématique/Environnement—Identité/Projet de vie

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
(c'est-à-dire 7)
et $\theta_{i}$ la position préférée par l'utilisateur sur l'axe $i$.

L'utilisateur est amené à sélectionner successivement des centres d'intérêts, on
note la séquence des centres d'intérêts sélectionnés par $(\vec c_t)_{1 <= t <= N}$
où $N = 154$ est le nombre de CI.

Après chaque sélection, on approxime $\vec\theta$ par la moyenne des 
CI sélectionnés jusque là :
$\vec\theta_t = \frac{\sum_{1 \le i \le t} \vec c_i}{t}$.

Pour recommander des centres d'intérêts proches ou éloignés des préférences d'un
utilisateur, on utilise comme mesure de proximité entre un centre d'intérêt $c$
et les préférences $\vec\theta_t$ la distance euclidienne :
$\operatorname{prox}(\vec c, \vec\theta_t) = || \vec c - \vec\theta_t ||$

Les CI proches à l'instant $t$ sont donnés du plus proches au plus éloignés par
la séquence des CI $C^P_t = (c_i)_{1 \le i \le N}$ triés par 
$\operatorname{prox}(\vec c, \vec\theta_t)$ croissant. Les CI éloignés à l'instant $t$
sont donnés par cette même séquence prise dans l'ordre inverse.

Pour recommander des centres d'intérêts d'ouverture, proches des préférences de
l'utilisateur sur tous les axes sauf un, on utilise la mesure 
$\operatorname{ouv}(\vec c, \vec\theta_t) = 
  \sum_{1 \le i \le d}{(\vec c - \vec\theta_t) \cdot \vec{o_i}}$ 
où $\vec{o_i}$ vaut $1$ sauf son i-ième élément qui vaut $-1$. L'expression 
$(\vec c - \vec\theta_t) \cdot \vec{o_i}$ donne donc la somme des distance sur
chaque axe sauf celle sur le i-ième axe, qui est retranchée. Ainsi, les points
qui sont proche des préférences sur les utilisateurs sur tous les axes sauf 1
auront un petit score d'ouverture, ce sont ceux qui seront présentés en premier
à l'utilisateur dans la liste des CI d'ouverture.

Les CI d'ouverture à l'instant $t$ sont donnés par la séquence des CI $C^O_t = (c_i)_{1 \le i \le N}$ triés par $\operatorname{ouv}(\vec c, \vec\theta_t)$ croissant.
