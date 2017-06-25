package net.bitnine.agensbrowser.bundle.model.meta;

import java.util.ArrayList;
import java.util.List;

public class AgensLabel {

/*
SELECT l.graphid as gr_oid, 
		l.oid as la_oid, l.labname as la_name, l.labkind as la_type,
		pg_catalog.pg_get_userbyid(c.relowner) as la_owner,
        coalesce(null, pg_catalog.obj_description(l.oid, 'ag_label'), '') as la_desc
FROM pg_catalog.ag_label l
    INNER JOIN pg_catalog.ag_graph g ON g.oid = l.graphid
	LEFT OUTER JOIN pg_catalog.pg_class c ON c.oid = l.relid
WHERE l.labname not in ('ag_vertex', 'ag_edge')	
ORDER BY l.graphid, l.oid;
 */
	public Long g_oid = -1L;
	public String g_name = "";

	public Long oid = -1L;
	public String type = "";	// type = [v, e]
	public String name = "";
	public String owner = "";
	public String desc = "";
	
	public boolean loaded_count = false;
	public Long count = 0L;

	public boolean loaded_properties = false;	
	public List<AgensProperty> properties = new ArrayList<AgensProperty>();
}
