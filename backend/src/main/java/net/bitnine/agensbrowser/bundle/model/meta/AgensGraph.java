package net.bitnine.agensbrowser.bundle.model.meta;

import java.util.ArrayList;
import java.util.List;

public class AgensGraph {

/*	
SELECT g.oid as gr_oid, g.graphname as gr_name, 
		coalesce(null, pg_catalog.obj_description(g.oid), '') as gr_desc
FROM pg_catalog.ag_graph g
	LEFT JOIN pg_catalog.pg_class c on c.oid = g.oid
ORDER BY g.oid;
*/	
	public Long oid = -1L;
	public String name = "";
	public String desc = "";
	
	public List<AgensLabel> vertexes = new ArrayList<AgensLabel>();;
	public List<AgensLabel> edges = new ArrayList<AgensLabel>();;
	
}

