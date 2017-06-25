package net.bitnine.agensbrowser.bundle.model.meta;

public class AgensProperty {
/*
	SELECT
	    json_data.key as json_key,
	    jsonb_typeof(json_data.value) as json_type,
	    count(*) as key_count
	FROM imdb_graph.company, jsonb_each(imdb_graph.company.properties) AS json_data
	group by 1, 2 order by 1, 2;
 */
	public String key = "";
	public String type = "";
	public Long count = 0L;
}
