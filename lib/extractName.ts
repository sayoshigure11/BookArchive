/* eslint-disable @typescript-eslint/no-explicit-any */
type Contributor = {
    SequenceNumber: string,
    ContributorRole: any[],
    PersonName: {
        content: string,
        collationkey: string
    }
}[]
export const extractName = (contributor: Contributor) => {
    const personsName = contributor.map((person) => {
        const content = person.PersonName.content
        const partsContent = content.split(/,\s*/)
        const filteredPartsContent = partsContent.filter((part) => {
            return !/\d{4}-$/.test(part)
        }).join(" ")

        const collationkey = person.PersonName.collationkey
        const partsCollationkey = collationkey.split(/,\s*/)
        const filteredPartsCollationkey = partsCollationkey.filter((part) => {
            return !/\d{4}-$/.test(part)
        }).join(" ")

        return {
            kanji: filteredPartsContent,
            yomi:filteredPartsCollationkey
        }
    })

    return personsName
}