import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Sommelier')
    .items([
      S.listItem()
        .title('Catalog')
        .child(
          S.list()
            .title('Catalog')
            .items([
              S.documentTypeListItem('wine').title('Wines'),
              S.listItem()
                .title('Wines needing review')
                .child(
                  S.documentList()
                    .title('Needs review')
                    .filter('_type == "wine" && reviewStatus == "needsReview"'),
                ),
              S.documentTypeListItem('producer').title('Producers'),
            ]),
        ),
      S.listItem()
        .title('Reference data')
        .child(
          S.list()
            .title('Reference data')
            .items([
              S.documentTypeListItem('appellation').title('Appellations'),
              S.documentTypeListItem('grape').title('Grapes'),
              S.documentTypeListItem('dish').title('Dishes'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('pairingRule').title('Pairing rules'),
      S.documentTypeListItem('guide').title('Guides'),
    ])
